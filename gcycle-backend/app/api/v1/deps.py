from collections.abc import Callable

from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.constants import UserRole
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repo import UserRepository


def get_bearer_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise UnauthorizedError("missing or malformed Authorization header")
    return authorization.split(" ", 1)[1].strip()


def get_current_user(
    token: str = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise UnauthorizedError("invalid or expired token") from exc

    if payload.get("type") not in ("access", "guest"):
        raise UnauthorizedError("token is not usable for authentication")

    user = UserRepository(db).get_by_id(payload["sub"])
    if not user or not user.is_active:
        raise UnauthorizedError("user not found or inactive")
    return user


def require_roles(*roles: UserRole) -> Callable[[User], User]:
    def _checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise ForbiddenError(f"requires one of roles: {[r.value for r in roles]}")
        return user
    return _checker


# Common role-gated dependencies
require_member = require_roles(UserRole.MEMBER, UserRole.ADMIN)
require_store_owner = require_roles(UserRole.STORE_OWNER, UserRole.ADMIN)
require_rider = require_roles(UserRole.RIDER, UserRole.ADMIN)
require_admin = require_roles(UserRole.ADMIN)
