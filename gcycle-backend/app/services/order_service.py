import logging
import uuid

from sqlalchemy.orm import Session

from app.core.constants import ContainerEventType, ContainerStatus, OrderStatus, RewardType
from app.core.exceptions import ConflictError, ForbiddenError, NotFoundError, ValidationAppError
from app.core.logging import audit_logger
from app.models.container import Container, ContainerEvent
from app.models.order import Order, OrderItem
from app.repositories.container_repo import ContainerRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.store_repo import StoreRepository
from app.schemas.order import OrderCreate
from app.services.reward_service import RewardService

logger = logging.getLogger(__name__)


class OrderService:
    def __init__(self, db: Session):
        self.db = db
        self.orders = OrderRepository(db)
        self.stores = StoreRepository(db)
        self.rewards = RewardService(db)

    def create_order(self, user_id: str, payload: OrderCreate) -> Order:
        store = self.stores.get_by_id(payload.store_id)
        if not store or not store.is_active:
            raise NotFoundError("store not found")

        if payload.qr_code_value:
            qr = self.stores.get_qr_code(payload.qr_code_value)
            if not qr or qr.store_id != store.id:
                raise ValidationAppError("invalid store QR code")

        if not payload.items:
            raise ValidationAppError("order must contain at least one item")

        order = Order(user_id=user_id, store_id=store.id, status=OrderStatus.PENDING)
        total = 0
        containers_to_issue: list[OrderItem] = []

        for item in payload.items:
            menu = self.orders.get_menu(item.menu_id)
            if not menu or menu.store_id != store.id or not menu.is_available:
                raise ValidationAppError(f"menu item not available: {item.menu_id}")
            line_total = menu.price * item.quantity
            total += line_total
            order_item = OrderItem(
                menu_id=menu.id,
                menu_name=menu.name,
                unit_price=menu.price,
                quantity=item.quantity,
                uses_container=item.uses_container,
            )
            order.items.append(order_item)
            if item.uses_container:
                containers_to_issue.append(order_item)

        order.total_amount = total
        order = self.orders.create(order)

        # Issue one reusable container per container-using item unit.
        for order_item in containers_to_issue:
            for _ in range(order_item.quantity):
                self._issue_container(order, store.id, user_id)

        order.status = OrderStatus.CONFIRMED
        order = self.orders.save(order)

        # Grant a small order-completion reward.
        self.rewards.grant(user_id=user_id, order_id=order.id, reward_type=RewardType.ORDER_BONUS, amount=100)

        audit_logger.info("order.created order_id=%s user_id=%s store_id=%s", order.id, user_id, store.id)
        return order

    def _issue_container(self, order: Order, store_id: str, holder_user_id: str) -> Container:
        serial = f"C-{uuid.uuid4().hex[:10].upper()}"
        qr_value = f"gcycle:container:{uuid.uuid4().hex}"
        container = Container(
            order_id=order.id,
            store_id=store_id,
            serial_number=serial,
            qr_code_value=qr_value,
            status=ContainerStatus.ISSUED,
            current_holder_user_id=holder_user_id,
        )
        self.db.add(container)
        self.db.commit()
        self.db.refresh(container)

        event = ContainerEvent(
            container_id=container.id,
            event_type=ContainerEventType.ISSUED,
            actor_user_id=holder_user_id,
        )
        ContainerRepository(self.db).add_event(event)
        audit_logger.info("container.issued container_id=%s order_id=%s", container.id, order.id)
        return container

    def get_order(self, order_id: str, requester_id: str, requester_role: str) -> Order:
        order = self.orders.get_by_id(order_id)
        if not order:
            raise NotFoundError("order not found")
        if order.user_id != requester_id and requester_role != "admin":
            raise ForbiddenError("not allowed to view this order")
        return order

    def list_my_orders(self, user_id: str) -> list[Order]:
        return self.orders.list_by_user(user_id)

    def update_status(self, order_id: str, new_status: OrderStatus, requester_id: str, requester_role: str) -> Order:
        order = self.get_order(order_id, requester_id, requester_role)
        valid_transitions = {
            OrderStatus.PENDING: {OrderStatus.CONFIRMED, OrderStatus.CANCELLED},
            OrderStatus.CONFIRMED: {OrderStatus.COMPLETED, OrderStatus.CANCELLED},
            OrderStatus.COMPLETED: set(),
            OrderStatus.CANCELLED: set(),
        }
        if new_status not in valid_transitions.get(order.status, set()):
            raise ConflictError(f"cannot transition order from {order.status} to {new_status}")
        order.status = new_status
        order = self.orders.save(order)
        audit_logger.info("order.status_changed order_id=%s status=%s", order.id, new_status)
        return order
