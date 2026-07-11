from datetime import datetime

from pydantic import BaseModel

from app.core.constants import PickupTaskStatus


class PickupTaskCreate(BaseModel):
    collection_point_id: str
    incentive_amount: int = 0


class PickupTaskOut(BaseModel):
    id: str
    rider_id: str | None
    collection_point_id: str
    status: PickupTaskStatus
    incentive_amount: int
    accepted_at: datetime | None
    completed_at: datetime | None
    collected_count: int

    class Config:
        from_attributes = True


class PickupTaskCompleteRequest(BaseModel):
    collected_count: int
