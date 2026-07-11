from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.core.response import success_response
from app.db.session import get_db
from app.models.user import User
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("")
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = OrderService(db)
    order = service.create_order(current_user.id, payload)
    return success_response(OrderOut.model_validate(order).model_dump(), message="order created")


@router.get("/me")
def list_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = OrderService(db)
    orders = service.list_my_orders(current_user.id)
    return success_response([OrderOut.model_validate(o).model_dump() for o in orders], message="ok")


@router.get("/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = OrderService(db)
    order = service.get_order(order_id, current_user.id, current_user.role.value)
    return success_response(OrderOut.model_validate(order).model_dump(), message="ok")


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = OrderService(db)
    order = service.update_status(order_id, payload.status, current_user.id, current_user.role.value)
    return success_response(OrderOut.model_validate(order).model_dump(), message="order status updated")
