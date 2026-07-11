from pydantic import BaseModel


class MenuOut(BaseModel):
    id: str
    store_id: str
    name: str
    price: int
    is_available: bool

    class Config:
        from_attributes = True
