from sqlalchemy import Boolean, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, new_uuid


class Store(Base, TimestampMixin):
    __tablename__ = "stores"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    owner_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("users.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    address: Mapped[str] = mapped_column(String(300))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    menus: Mapped[list["Menu"]] = relationship(back_populates="store")  # noqa: F821
    qr_codes: Mapped[list["StoreQRCode"]] = relationship(back_populates="store")
    orders: Mapped[list["Order"]] = relationship(back_populates="store")  # noqa: F821


class StoreQRCode(Base, TimestampMixin):
    __tablename__ = "store_qr_codes"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    store_id: Mapped[str] = mapped_column(String(32), ForeignKey("stores.id"), index=True)
    code_value: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    store: Mapped["Store"] = relationship(back_populates="qr_codes")
