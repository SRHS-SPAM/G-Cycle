from pydantic import BaseModel, EmailStr, Field

from app.core.constants import UserRole


class RegisterRequest(BaseModel):
    phone_number: str = Field(min_length=9, max_length=20)
    email: EmailStr | None = None
    password: str = Field(min_length=8, max_length=128)
    name: str | None = None


class LoginRequest(BaseModel):
    phone_number: str
    password: str


class GuestOrderRequest(BaseModel):
    phone_number: str = Field(min_length=9, max_length=20)


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class GuestTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class MeResponse(BaseModel):
    id: str
    phone_number: str
    email: str | None = None
    name: str | None = None
    role: UserRole
    is_guest: bool

    class Config:
        from_attributes = True
