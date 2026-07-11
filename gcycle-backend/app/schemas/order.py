from pydantic import BaseModel, Field

from app.core.constants import OrderStatus, PaymentStatus


class OrderItemCreate(BaseModel):
    menu_id: str
    quantity: int = Field(default=1, ge=1)
    uses_container: bool = True


class OrderCreate(BaseModel):
    store_id: str
    qr_code_value: str | None = None
    items: list[OrderItemCreate]


class OrderItemOut(BaseModel):
    id: str
    menu_id: str
    menu_name: str
    unit_price: int
    quantity: int
    uses_container: bool

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: str
    user_id: str
    store_id: str
    status: OrderStatus
    total_amount: int
    payment_status: PaymentStatus
    items: list[OrderItemOut] = []

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
