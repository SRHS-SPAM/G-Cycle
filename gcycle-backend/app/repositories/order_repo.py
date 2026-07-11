from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.order import Order
from app.models.menu import Menu


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_menu(self, menu_id: str) -> Menu | None:
        return self.db.get(Menu, menu_id)

    def get_by_id(self, order_id: str) -> Order | None:
        stmt = select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def list_by_user(self, user_id: str, limit: int = 50, offset: int = 0) -> list[Order]:
        stmt = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.execute(stmt).scalars().all())

    def create(self, order: Order) -> Order:
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        return order

    def save(self, order: Order) -> Order:
        self.db.commit()
        self.db.refresh(order)
        return order
