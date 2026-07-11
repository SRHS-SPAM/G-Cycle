"""Create all tables directly (useful for local dev / tests).

In production, prefer Alembic migrations instead of calling this.
"""
from app.db.base import Base
from app.db.session import engine

# Import all models so they are registered on Base.metadata before create_all.
from app.models import (  # noqa: F401
    user, store, menu, order, container,
    collection_point, pickup_task, reward, audit_log, notification,
)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
