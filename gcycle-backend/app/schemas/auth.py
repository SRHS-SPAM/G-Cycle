from pydantic import BaseModel, EmailStr, Field, field_validator
from app.core.constants import UserRole


class RegisterRequest(BaseModel):
    phone_number: str = Field(..., min_length=9, max_length=20)
    email: EmailStr | None = None
    password: str = Field(..., min_length=8, max_length=128)
    name: str | None = None


# 🌟 에러의 원인이 된 누락된 클래스 추가
class LoginRequest(BaseModel):
    phone_number: str
    password: str


class GuestOrderRequest(BaseModel):
    phone_number: str = Field(..., min_length=9, max_length=20, description="하이픈 없는 번호")
    identity_verification_token: str = Field(..., description="외부 본인인증 API 성공 토큰/UID")
    customer_uid: str = Field(..., description="PG사 결제수단 가등록 후 발급된 빌링키")
    penalty_policy_agreed: bool = Field(..., description="미반납 패널티 및 자동결제 자동 동의 여부")

    @field_validator("penalty_policy_agreed")
    @classmethod
    def must_be_true(cls, v: bool) -> bool:
        if not v:
            raise ValueError("미반납 패널티 및 자동결제 동의가 필수입니다.")
        return v


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
    is_identity_verified: bool

    class Config:
        from_attributes = True