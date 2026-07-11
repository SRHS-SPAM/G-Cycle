from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import success_response
from app.db.session import get_db
from app.schemas.collection_point import CollectionPointOut
from app.services.map_service import MapService

router = APIRouter(prefix="/collection-points", tags=["collection-points"])


@router.get("")
def list_collection_points(db: Session = Depends(get_db)):
    service = MapService(db)
    points = service.list_all()
    return success_response([CollectionPointOut.model_validate(p).model_dump() for p in points], message="ok")


@router.get("/map")
def map_view(
    lat: float = Query(...),
    lng: float = Query(...),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    service = MapService(db)
    nearest = service.nearest(lat, lng, limit)
    data = [
        {**CollectionPointOut.model_validate(cp).model_dump(), "distance_km": distance}
        for cp, distance in nearest
    ]
    return success_response(data, message="ok")


@router.get("/{collection_point_id}")
def get_collection_point(collection_point_id: str, db: Session = Depends(get_db)):
    service = MapService(db)
    cp = service.get(collection_point_id)
    return success_response(CollectionPointOut.model_validate(cp).model_dump(), message="ok")
