from pydantic import BaseModel

from app.core.constants import ContainerStatus


class ContainerScanRequest(BaseModel):
    qr_code_value: str
    collection_point_id: str | None = None  # required when scanning to return a container


class ContainerOut(BaseModel):
    id: str
    order_id: str | None
    store_id: str
    serial_number: str
    qr_code_value: str
    status: ContainerStatus
    current_collection_point_id: str | None

    class Config:
        from_attributes = True
