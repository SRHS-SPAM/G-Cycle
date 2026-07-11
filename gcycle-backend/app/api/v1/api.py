from fastapi import APIRouter

from app.api.v1.routers import (
    admin,
    auth,
    collection_points,
    containers,
    orders,
    pickup_tasks,
    rewards,
    stores,
    users,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(stores.router)
api_router.include_router(orders.router)
api_router.include_router(containers.router)
api_router.include_router(collection_points.router)
api_router.include_router(pickup_tasks.router)
api_router.include_router(rewards.router)
api_router.include_router(admin.router)
