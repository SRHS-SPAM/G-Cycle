from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.core.response import success_response
from app.db.session import get_db
from app.models.user import User
from app.schemas.reward import RewardClaimRequest, RewardOut, RewardTransactionOut
from app.services.reward_service import RewardService

router = APIRouter(prefix="/rewards", tags=["rewards"])


@router.get("/me")
def list_my_rewards(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = RewardService(db)
    rewards = service.list_my_rewards(current_user.id)
    return success_response([RewardOut.model_validate(r).model_dump() for r in rewards], message="ok")


@router.get("/transactions")
def list_my_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = RewardService(db)
    txs = service.list_my_transactions(current_user.id)
    return success_response([RewardTransactionOut.model_validate(t).model_dump() for t in txs], message="ok")


@router.post("/claim")
def claim_reward(
    payload: RewardClaimRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = RewardService(db)
    reward = service.claim(current_user.id, payload.reward_id)
    return success_response(RewardOut.model_validate(reward).model_dump(), message="reward claimed")
