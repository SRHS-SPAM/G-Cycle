from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import ContainerEventType, ContainerStatus
from app.db.base import Base, TimestampMixin, new_uuid


class Container(Base, TimestampMixin):
    __tablename__ = "containers"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    order_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("orders.id"), nullable=True, index=True)
    store_id: Mapped[str] = mapped_column(String(32), ForeignKey("stores.id"), index=True)
    serial_number: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    qr_code_value: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    status: Mapped[ContainerStatus] = mapped_column(Enum(ContainerStatus), default=ContainerStatus.ISSUED, index=True)
    current_collection_point_id: Mapped[str | None] = mapped_column(
        String(32), ForeignKey("collection_points.id"), nullable=True, index=True
    )
    current_holder_user_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("users.id"), nullable=True)

    order: Mapped["Order"] = relationship(back_populates="containers")
    events: Mapped[list["ContainerEvent"]] = relationship(back_populates="container", cascade="all, delete-orphan")


class ContainerEvent(Base, TimestampMixin):
    """Append-only event log — the source of truth for a container's lifecycle."""
    __tablename__ = "container_events"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    container_id: Mapped[str] = mapped_column(String(32), ForeignKey("containers.id"), index=True)
    event_type: Mapped[ContainerEventType] = mapped_column(Enum(ContainerEventType), index=True)
    actor_user_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("users.id"), nullable=True)
    collection_point_id: Mapped[str | None] = mapped_column(
        String(32), ForeignKey("collection_points.id"), nullable=True
    )
    occurred_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True))
    note: Mapped[str | None] = mapped_column(String(500), nullable=True)

    container: Mapped["Container"] = relationship(back_populates="events")
