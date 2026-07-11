import logging

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.collection_point import CollectionPoint
from app.repositories.collection_point_repo import CollectionPointRepository
from app.utils.geo import haversine_distance_km

logger = logging.getLogger(__name__)


class MapService:
    """Read-side service for collection point discovery / map rendering."""

    def __init__(self, db: Session):
        self.db = db
        self.collection_points = CollectionPointRepository(db)

    def list_all(self) -> list[CollectionPoint]:
        return self.collection_points.list_all()

    def get(self, collection_point_id: str) -> CollectionPoint:
        cp = self.collection_points.get_by_id(collection_point_id)
        if not cp:
            raise NotFoundError("collection point not found")
        return cp

    def nearest(self, lat: float, lng: float, limit: int = 10) -> list[tuple[CollectionPoint, float]]:
        points = self.collection_points.list_all()
        scored = [(cp, haversine_distance_km(lat, lng, cp.lat, cp.lng)) for cp in points]
        scored.sort(key=lambda pair: pair[1])
        return scored[:limit]
