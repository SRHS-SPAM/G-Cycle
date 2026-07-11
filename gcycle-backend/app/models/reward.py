from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import RewardStatus, RewardType
from app.db.base import Base, TimestampMixin, new_uuid


class Reward(Base, TimestampMixin):
    __tablename__ = "rewards"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    order_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("orders.id"), nullable=True)
    reward_type: Mapped[RewardType] = mapped_column(Enum(RewardType), index=True)
    amount: Mapped[int] = mapped_column(Integer)
    status: Mapped[RewardStatus] = mapped_column(Enum(RewardStatus), default=RewardStatus.PENDING, index=True)

    user: Mapped["User"] = relationship(back_populates="rewards")
    transactions: Mapped[list["RewardTransaction"]] = relationship(
        back_populates="reward", cascade="all, delete-orphan"
    )


class RewardTransaction(Base, TimestampMixin):
    """Ledger entry — every balance-affecting action on a reward is recorded here."""
    __tablename__ = "reward_transactions"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_uuid)
    reward_id: Mapped[str] = mapped_column(String(32), ForeignKey("rewards.id"), index=True)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    action: Mapped[str] = mapped_column(String(50))  # e.g. "granted", "claimed", "cancelled"
    amount: Mapped[int] = mapped_column(Integer)
    balance_after: Mapped[int] = mapped_column(Integer, default=0)

    reward: Mapped["Reward"] = relationship(back_populates="transactions")
