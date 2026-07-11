from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.core.response import success_response
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    GuestOrderRequest,
    GuestTokenResponse,
    LoginRequest,
    MeResponse,
    RefreshRequest,
    RegisterRequest,
    TokenPair,
)
from app.schemas.user import UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.register(payload)
    return success_response(UserOut.model_validate(user).model_dump(), message="user registered")


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    access, refresh = service.login(payload)
    return success_response(TokenPair(access_token=access, refresh_token=refresh).model_dump(), message="login ok")


@router.post("/guest")
def guest_session(payload: GuestOrderRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    token = service.guest_session(payload.phone_number)
    return success_response(GuestTokenResponse(access_token=token).model_dump(), message="guest session created")


@router.post("/refresh")
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    access = service.refresh(payload.refresh_token)
    return success_response({"access_token": access, "token_type": "bearer"}, message="token refreshed")


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    # Stateless JWTs: logout is a client-side token discard. A denylist can be
    # added via Redis if server-side revocation becomes a requirement.
    return success_response(None, message="logged out")


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return success_response(MeResponse.model_validate(current_user).model_dump(), message="ok")

@router.post("/guest")
def guest_session(payload: GuestOrderRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    # 🌟 폰번호 문자열 대신 payload 객체 통째로 전달하도록 수정
    token = service.guest_session(payload)
    return success_response(
        GuestTokenResponse(access_token=token).model_dump(), 
        message="guest identity verified and session created"
    )