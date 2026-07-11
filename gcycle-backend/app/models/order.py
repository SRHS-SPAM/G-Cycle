from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import OrderStatus, PaymentStatus
from app.db.base import Base, TimestampMixin, new_uuid


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    store_id: Mapped[str] = mapped_column(String(32), ForeignKey("stores.id"), index=True)
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.PENDING, index=True)
    total_amount: Mapped[int] = mapped_column(Integer, default=0)
    payment_status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), default=PaymentStatus.UNPAID)

    user: Mapped["User"] = relationship(back_populates="orders")  # noqa: F821
    store: Mapped["Store"] = relationship(back_populates="orders")  # noqa: F821
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    containers: Mapped[list["Container"]] = relationship(back_populates="order")  # noqa: F821


class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    order_id: Mapped[str] = mapped_column(String(32), ForeignKey("orders.id"), index=True)
    menu_id: Mapped[str] = mapped_column(String(32), ForeignKey("menus.id"))
    menu_name: Mapped[str] = mapped_column(String(200))
    unit_price: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    uses_container: Mapped[bool] = mapped_column(default=True)

    order: Mapped["Order"] = relationship(back_populates="items")
