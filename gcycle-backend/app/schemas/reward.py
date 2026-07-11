from pydantic import BaseModel

from app.core.constants import RewardStatus, RewardType


class RewardOut(BaseModel):
    id: str
    user_id: str
    order_id: str | None
    reward_type: RewardType
    amount: int
    status: RewardStatus

    class Config:
        from_attributes = True


class RewardTransactionOut(BaseModel):
    id: str
    reward_id: str
    action: str
    amount: int
    balance_after: int

    class Config:
        from_attributes = True


class RewardClaimRequest(BaseModel):
    reward_id: str
