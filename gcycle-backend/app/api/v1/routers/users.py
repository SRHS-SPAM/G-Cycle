from fastapi import APIRouter, Depends

from app.api.v1.deps import get_current_user
from app.core.response import success_response
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return success_response(UserOut.model_validate(current_user).model_dump(), message="ok")
