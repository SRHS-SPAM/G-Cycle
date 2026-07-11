from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.collection_point import CollectionPoint


class CollectionPointRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, collection_point_id: str) -> CollectionPoint | None:
        return self.db.get(CollectionPoint, collection_point_id)

    def list_all(self) -> list[CollectionPoint]:
        stmt = select(CollectionPoint)
        return list(self.db.execute(stmt).scalars().all())

    def save(self, cp: CollectionPoint) -> CollectionPoint:
        self.db.commit()
        self.db.refresh(cp)
        return cp

    def create(self, cp: CollectionPoint) -> CollectionPoint:
        self.db.add(cp)
        self.db.commit()
        self.db.refresh(cp)
        return cp
