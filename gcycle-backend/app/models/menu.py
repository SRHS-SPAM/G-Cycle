from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, new_uuid


class Menu(Base, TimestampMixin):
    __tablename__ = "menus"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    store_id: Mapped[str] = mapped_column(String(32), ForeignKey("stores.id"), index=True)
    name: Mapped[str] = mapped_column(String(200))
    price: Mapped[int] = mapped_column(Integer)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)

    store: Mapped["Store"] = relationship(back_populates="menus")
