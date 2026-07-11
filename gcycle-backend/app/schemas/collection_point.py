from pydantic import BaseModel

from app.core.constants import CollectionPointStatus


class CollectionPointOut(BaseModel):
    id: str
    name: str
    address: str
    lat: float
    lng: float
    capacity: int
    current_count: int
    fill_rate: float
    status: CollectionPointStatus

    class Config:
        from_attributes = True
