from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.constants import PickupTaskStatus
from app.models.pickup_task import PickupTask


class PickupTaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, task_id: str) -> PickupTask | None:
        return self.db.get(PickupTask, task_id)

    def list_open(self) -> list[PickupTask]:
        stmt = select(PickupTask).where(PickupTask.status == PickupTaskStatus.OPEN)
        return list(self.db.execute(stmt).scalars().all())

    def list_by_rider(self, rider_id: str) -> list[PickupTask]:
        stmt = select(PickupTask).where(PickupTask.rider_id == rider_id)
        return list(self.db.execute(stmt).scalars().all())

    def create(self, task: PickupTask) -> PickupTask:
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def save(self, task: PickupTask) -> PickupTask:
        self.db.commit()
        self.db.refresh(task)
        return task
