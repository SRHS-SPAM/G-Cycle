import logging

from sqlalchemy.orm import Session

from app.core.constants import UserRole
from app.core.exceptions import ConflictError, UnauthorizedError
from app.core.logging import audit_logger
from app.core.security import (
    create_access_token,
    create_guest_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.users = UserRepository(db)

    def register(self, payload: RegisterRequest) -> User:
        if self.users.get_by_phone(payload.phone_number):
            raise ConflictError("phone number already registered")
        if payload.email and self.users.get_by_email(payload.email):
            raise ConflictError("email already registered")

        user = User(
            phone_number=payload.phone_number,
            email=payload.email,
            password_hash=hash_password(payload.password),
            name=payload.name,
            role=UserRole.MEMBER,
        )
        user = self.users.create(user)
        audit_logger.info("auth.register user_id=%s phone=%s", user.id, user.phone_number)
        return user

    def login(self, payload: LoginRequest) -> tuple[str, str]:
        user = self.users.get_by_phone(payload.phone_number)
        if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
            audit_logger.warning("auth.login_failed phone=%s", payload.phone_number)
            raise UnauthorizedError("invalid phone number or password")
        if not user.is_active:
            raise UnauthorizedError("account is deactivated")

        access = create_access_token(user.id, user.role.value)
        refresh = create_refresh_token(user.id, user.role.value)
        audit_logger.info("auth.login user_id=%s", user.id)
        return access, refresh

    def guest_session(self, phone_number: str) -> str:
        user = self.users.get_by_phone(phone_number)
        if not user:
            user = User(
                phone_number=phone_number,
                role=UserRole.GUEST,
                is_guest=True,
            )
            user = self.users.create(user)
        token = create_guest_token(user.id, phone_number)
        audit_logger.info("auth.guest_session user_id=%s phone=%s", user.id, phone_number)
        return token

    def refresh(self, refresh_token: str) -> str:
        try:
            payload = decode_token(refresh_token)
        except ValueError as exc:
            raise UnauthorizedError("invalid refresh token") from exc

        if payload.get("type") != "refresh":
            raise UnauthorizedError("token is not a refresh token")

        user = self.users.get_by_id(payload["sub"])
        if not user or not user.is_active:
            raise UnauthorizedError("user not found or inactive")

        return create_access_token(user.id, user.role.value)
