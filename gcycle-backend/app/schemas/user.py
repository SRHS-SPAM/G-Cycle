from pydantic import BaseModel

from app.core.constants import UserRole


class UserOut(BaseModel):
    id: str
    phone_number: str
    email: str | None
    name: str | None
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True
