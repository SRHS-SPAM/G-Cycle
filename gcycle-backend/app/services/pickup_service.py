import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.constants import (
    CollectionPointStatus,
    ContainerEventType,
    ContainerStatus,
    PickupTaskStatus,
    RewardType,
)
from app.core.exceptions import ConflictError, ForbiddenError, NotFoundError
from app.core.logging import audit_logger
from app.models.container import ContainerEvent
from app.models.pickup_task import PickupTask
from app.repositories.collection_point_repo import CollectionPointRepository
from app.repositories.container_repo import ContainerRepository
from app.repositories.pickup_task_repo import PickupTaskRepository
from app.schemas.pickup_task import PickupTaskCreate
from app.services.reward_service import RewardService

logger = logging.getLogger(__name__)


class PickupService:
    def __init__(self, db: Session):
        self.db = db
        self.tasks = PickupTaskRepository(db)
        self.collection_points = CollectionPointRepository(db)
        self.containers = ContainerRepository(db)
        self.rewards = RewardService(db)

    def create_task(self, payload: PickupTaskCreate) -> PickupTask:
        cp = self.collection_points.get_by_id(payload.collection_point_id)
        if not cp:
            raise NotFoundError("collection point not found")
        task = PickupTask(
            collection_point_id=cp.id,
            status=PickupTaskStatus.OPEN,
            incentive_amount=payload.incentive_amount,
        )
        task = self.tasks.create(task)
        audit_logger.info("pickup_task.created task_id=%s collection_point_id=%s", task.id, cp.id)
        return task

    def list_open_tasks(self) -> list[PickupTask]:
        return self.tasks.list_open()

    def list_my_tasks(self, rider_id: str) -> list[PickupTask]:
        return self.tasks.list_by_rider(rider_id)

    def get_task(self, task_id: str) -> PickupTask:
        task = self.tasks.get_by_id(task_id)
        if not task:
            raise NotFoundError("pickup task not found")
        return task

    def accept_task(self, task_id: str, rider_id: str) -> PickupTask:
        task = self.get_task(task_id)
        if task.status != PickupTaskStatus.OPEN:
            raise ConflictError(f"task cannot be accepted from status '{task.status.value}'")
        task.rider_id = rider_id
        task.status = PickupTaskStatus.ACCEPTED
        task.accepted_at = datetime.now(timezone.utc)
        task = self.tasks.save(task)
        audit_logger.info("pickup_task.accepted task_id=%s rider_id=%s", task.id, rider_id)
        return task

    def complete_task(self, task_id: str, rider_id: str, collected_count: int) -> PickupTask:
        task = self.get_task(task_id)
        if task.rider_id != rider_id:
            raise ForbiddenError("only the assigned rider can complete this task")
        if task.status != PickupTaskStatus.ACCEPTED:
            raise ConflictError(f"task cannot be completed from status '{task.status.value}'")

        cp = self.collection_points.get_by_id(task.collection_point_id)
        if not cp:
            raise NotFoundError("collection point not found")

        actual_collected = min(collected_count, cp.current_count)

        # Mark containers currently sitting at this collection point as collected.
        from sqlalchemy import select
        from app.models.container import Container as ContainerModel

        stmt = (
            select(ContainerModel)
            .where(
                ContainerModel.current_collection_point_id == cp.id,
                ContainerModel.status == ContainerStatus.RETURNED,
            )
            .limit(actual_collected)
        )
        collected_containers = list(self.db.execute(stmt).scalars().all())
        for container in collected_containers:
            container.status = ContainerStatus.COLLECTED
            container.current_collection_point_id = None
            self.containers.save(container)
            event = ContainerEvent(
                container_id=container.id,
                event_type=ContainerEventType.COLLECTED,
                actor_user_id=rider_id,
                collection_point_id=cp.id,
                occurred_at=None,
            )
            self.containers.add_event(event)

        # Update collection point saturation.
        cp.current_count = max(0, cp.current_count - actual_collected)
        cp.fill_rate = round(cp.current_count / cp.capacity, 4) if cp.capacity else 0.0
        cp.status = (
            CollectionPointStatus.FULL if cp.fill_rate >= 1.0
            else CollectionPointStatus.NEAR_FULL if cp.fill_rate >= 0.8
            else CollectionPointStatus.NORMAL
        )
        self.collection_points.save(cp)

        task.status = PickupTaskStatus.COMPLETED
        task.completed_at = datetime.now(timezone.utc)
        task.collected_count = actual_collected
        task = self.tasks.save(task)

        # Pay out the rider incentive.
        if task.incentive_amount > 0:
            self.rewards.grant(
                user_id=rider_id, order_id=None,
                reward_type=RewardType.PICKUP_INCENTIVE, amount=task.incentive_amount,
            )

        audit_logger.info(
            "pickup_task.completed task_id=%s rider_id=%s collected_count=%s",
            task.id, rider_id, actual_collected,
        )
        return task
