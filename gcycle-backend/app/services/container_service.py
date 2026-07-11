import logging

from sqlalchemy.orm import Session

from app.core.constants import (
    CollectionPointStatus,
    ContainerEventType,
    ContainerStatus,
    RewardType,
)
from app.core.exceptions import ConflictError, NotFoundError, ValidationAppError
from app.core.logging import audit_logger
from app.models.container import Container, ContainerEvent
from app.repositories.collection_point_repo import CollectionPointRepository
from app.repositories.container_repo import ContainerRepository
from app.schemas.container import ContainerScanRequest
from app.services.reward_service import RewardService

logger = logging.getLogger(__name__)


class ContainerService:
    """
    Handles container lifecycle transitions triggered by QR scans:
    issued -> in_use -> returned -> collected -> washed -> issued (cycle repeats)
    """

    def __init__(self, db: Session):
        self.db = db
        self.containers = ContainerRepository(db)
        self.collection_points = CollectionPointRepository(db)
        self.rewards = RewardService(db)

    def scan(self, user_id: str, payload: ContainerScanRequest) -> Container:
        container = self.containers.get_by_qr(payload.qr_code_value)
        if not container:
            raise NotFoundError("container not found for this QR code")

        # A scan without a collection point is treated as a plain status/lookup scan.
        if payload.collection_point_id is None:
            return container

        return self._return_container(user_id, container, payload.collection_point_id)

    def _return_container(self, user_id: str, container: Container, collection_point_id: str) -> Container:
        if container.status not in (ContainerStatus.ISSUED, ContainerStatus.IN_USE):
            raise ConflictError(f"container cannot be returned from status '{container.status.value}'")

        cp = self.collection_points.get_by_id(collection_point_id)
        if not cp:
            raise NotFoundError("collection point not found")
        if cp.current_count >= cp.capacity:
            raise ConflictError("collection point is at full capacity")

        container.status = ContainerStatus.RETURNED
        container.current_collection_point_id = cp.id
        container.current_holder_user_id = None
        container = self.containers.save(container)

        event = ContainerEvent(
            container_id=container.id,
            event_type=ContainerEventType.RETURNED,
            actor_user_id=user_id,
            collection_point_id=cp.id,
            occurred_at=None,
        )
        self.containers.add_event(event)

        # Recompute collection point saturation.
        cp.current_count += 1
        cp.fill_rate = round(cp.current_count / cp.capacity, 4) if cp.capacity else 0.0
        cp.status = self._recalc_status(cp.fill_rate)
        self.collection_points.save(cp)

        # Small reward for returning a container.
        self.rewards.grant(user_id=user_id, order_id=None, reward_type=RewardType.RETURN_BONUS, amount=50)

        audit_logger.info(
            "container.returned container_id=%s collection_point_id=%s fill_rate=%.2f",
            container.id, cp.id, cp.fill_rate,
        )
        return container

    @staticmethod
    def _recalc_status(fill_rate: float) -> CollectionPointStatus:
        from app.core.config import settings
        if fill_rate >= 1.0:
            return CollectionPointStatus.FULL
        if fill_rate >= settings.NEAR_FULL_THRESHOLD:
            return CollectionPointStatus.NEAR_FULL
        return CollectionPointStatus.NORMAL

    def get_container(self, container_id: str) -> Container:
        container = self.containers.get_by_id(container_id)
        if not container:
            raise NotFoundError("container not found")
        return container

    def list_my_containers(self, user_id: str) -> list[Container]:
        return self.containers.list_by_holder(user_id)
