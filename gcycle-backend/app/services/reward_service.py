import logging

from sqlalchemy.orm import Session

from app.core.constants import RewardStatus, RewardType
from app.core.exceptions import ConflictError, ForbiddenError, NotFoundError
from app.core.logging import audit_logger
from app.models.reward import Reward, RewardTransaction
from app.repositories.reward_repo import RewardRepository

logger = logging.getLogger(__name__)


class RewardService:
    def __init__(self, db: Session):
        self.db = db
        self.rewards = RewardRepository(db)

    def grant(self, user_id: str, order_id: str | None, reward_type: RewardType, amount: int) -> Reward:
        reward = Reward(
            user_id=user_id,
            order_id=order_id,
            reward_type=reward_type,
            amount=amount,
            status=RewardStatus.CONFIRMED,
        )
        reward = self.rewards.create(reward)

        tx = RewardTransaction(
            reward_id=reward.id,
            user_id=user_id,
            action="granted",
            amount=amount,
            balance_after=amount,
        )
        self.rewards.add_transaction(tx)

        audit_logger.info("reward.granted reward_id=%s user_id=%s type=%s amount=%s",
                           reward.id, user_id, reward_type.value, amount)
        return reward

    def list_my_rewards(self, user_id: str) -> list[Reward]:
        return self.rewards.list_by_user(user_id)

    def list_my_transactions(self, user_id: str) -> list[RewardTransaction]:
        return self.rewards.list_transactions_by_user(user_id)

    def claim(self, user_id: str, reward_id: str) -> Reward:
        reward = self.rewards.get_by_id(reward_id)
        if not reward:
            raise NotFoundError("reward not found")
        if reward.user_id != user_id:
            raise ForbiddenError("not allowed to claim this reward")
        if reward.status != RewardStatus.CONFIRMED:
            raise ConflictError(f"reward cannot be claimed from status '{reward.status.value}'")

        reward.status = RewardStatus.CLAIMED
        reward = self.rewards.save(reward)

        tx = RewardTransaction(
            reward_id=reward.id,
            user_id=user_id,
            action="claimed",
            amount=reward.amount,
            balance_after=0,
        )
        self.rewards.add_transaction(tx)

        audit_logger.info("reward.claimed reward_id=%s user_id=%s amount=%s", reward.id, user_id, reward.amount)
        return reward
