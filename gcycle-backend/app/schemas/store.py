from pydantic import BaseModel, Field


class StoreCreate(BaseModel):
    name: str
    address: str
    lat: float
    lng: float


class StoreUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    lat: float | None = None
    lng: float | None = None
    is_active: bool | None = None


class StoreOut(BaseModel):
    id: str
    name: str
    address: str
    lat: float
    lng: float
    is_active: bool

    class Config:
        from_attributes = True
