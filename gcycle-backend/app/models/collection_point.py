from sqlalchemy import Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import CollectionPointStatus
from app.db.base import Base, TimestampMixin, new_uuid


class CollectionPoint(Base, TimestampMixin):
    __tablename__ = "collection_points"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200))
    address: Mapped[str] = mapped_column(String(300))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    capacity: Mapped[int] = mapped_column(Integer, default=100)
    current_count: Mapped[int] = mapped_column(Integer, default=0)
    fill_rate: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[CollectionPointStatus] = mapped_column(
        Enum(CollectionPointStatus), default=CollectionPointStatus.NORMAL, index=True
    )

    pickup_tasks: Mapped[list["PickupTask"]] = relationship(back_populates="collection_point")  # noqa: F821
