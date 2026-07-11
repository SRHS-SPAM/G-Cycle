from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.reward import Reward, RewardTransaction


class RewardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, reward_id: str) -> Reward | None:
        return self.db.get(Reward, reward_id)

    def list_by_user(self, user_id: str) -> list[Reward]:
        stmt = select(Reward).where(Reward.user_id == user_id).order_by(Reward.created_at.desc())
        return list(self.db.execute(stmt).scalars().all())

    def list_transactions_by_user(self, user_id: str) -> list[RewardTransaction]:
        stmt = (
            select(RewardTransaction)
            .where(RewardTransaction.user_id == user_id)
            .order_by(RewardTransaction.created_at.desc())
        )
        return list(self.db.execute(stmt).scalars().all())

    def create(self, reward: Reward) -> Reward:
        self.db.add(reward)
        self.db.commit()
        self.db.refresh(reward)
        return reward

    def save(self, reward: Reward) -> Reward:
        self.db.commit()
        self.db.refresh(reward)
        return reward

    def add_transaction(self, tx: RewardTransaction) -> RewardTransaction:
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(tx)
        return tx
