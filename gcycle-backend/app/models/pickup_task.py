from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import PickupTaskStatus
from app.db.base import Base, TimestampMixin, new_uuid


class PickupTask(Base, TimestampMixin):
    __tablename__ = "pickup_tasks"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    rider_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("users.id"), nullable=True, index=True)
    collection_point_id: Mapped[str] = mapped_column(String(32), ForeignKey("collection_points.id"), index=True)
    status: Mapped[PickupTaskStatus] = mapped_column(Enum(PickupTaskStatus), default=PickupTaskStatus.OPEN, index=True)
    incentive_amount: Mapped[int] = mapped_column(Integer, default=0)
    accepted_at: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    collected_count: Mapped[int] = mapped_column(Integer, default=0)

    rider: Mapped["User"] = relationship(back_populates="pickup_tasks")  # noqa: F821
    collection_point: Mapped["CollectionPoint"] = relationship(back_populates="pickup_tasks")
