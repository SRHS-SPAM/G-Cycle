from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.v1.deps import require_admin
from app.core.constants import ContainerStatus, OrderStatus, RewardStatus
from app.core.response import success_response
from app.db.session import get_db
from app.models.container import Container
from app.models.order import Order
from app.models.reward import Reward
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    total_orders = db.execute(select(func.count()).select_from(Order)).scalar_one()
    total_containers = db.execute(select(func.count()).select_from(Container)).scalar_one()
    total_rewards_paid = db.execute(
        select(func.coalesce(func.sum(Reward.amount), 0)).where(Reward.status != RewardStatus.CANCELLED)
    ).scalar_one()
    data = {
        "total_orders": total_orders,
        "total_containers": total_containers,
        "total_rewards_paid": int(total_rewards_paid),
    }
    return success_response(data, message="ok")


@router.get("/stats/orders")
def order_stats(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    rows = db.execute(
        select(Order.status, func.count()).group_by(Order.status)
    ).all()
    data = {status.value: count for status, count in rows}
    for status in OrderStatus:
        data.setdefault(status.value, 0)
    return success_response(data, message="ok")


@router.get("/stats/containers")
def container_stats(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    rows = db.execute(
        select(Container.status, func.count()).group_by(Container.status)
    ).all()
    data = {status.value: count for status, count in rows}
    for status in ContainerStatus:
        data.setdefault(status.value, 0)
    return success_response(data, message="ok")


@router.get("/stats/rewards")
def reward_stats(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    rows = db.execute(
        select(Reward.reward_type, func.count(), func.coalesce(func.sum(Reward.amount), 0))
        .group_by(Reward.reward_type)
    ).all()
    data = {
        reward_type.value: {"count": count, "total_amount": int(total)}
        for reward_type, count, total in rows
    }
    return success_response(data, message="ok")
