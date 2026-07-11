from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.container import Container, ContainerEvent


class ContainerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, container_id: str) -> Container | None:
        return self.db.get(Container, container_id)

    def get_by_qr(self, qr_code_value: str) -> Container | None:
        stmt = select(Container).where(Container.qr_code_value == qr_code_value)
        return self.db.execute(stmt).scalar_one_or_none()

    def list_by_holder(self, user_id: str) -> list[Container]:
        stmt = select(Container).where(Container.current_holder_user_id == user_id)
        return list(self.db.execute(stmt).scalars().all())

    def create(self, container: Container) -> Container:
        self.db.add(container)
        self.db.commit()
        self.db.refresh(container)
        return container

    def save(self, container: Container) -> Container:
        self.db.commit()
        self.db.refresh(container)
        return container

    def add_event(self, event: ContainerEvent) -> ContainerEvent:
        if event.occurred_at is None:
            event.occurred_at = datetime.now(timezone.utc)
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event
