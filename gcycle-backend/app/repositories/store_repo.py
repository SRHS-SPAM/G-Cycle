from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.store import Store, StoreQRCode


class StoreRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_active(self, limit: int = 50, offset: int = 0) -> list[Store]:
        stmt = select(Store).where(Store.is_active.is_(True)).limit(limit).offset(offset)
        return list(self.db.execute(stmt).scalars().all())

    def get_by_id(self, store_id: str) -> Store | None:
        return self.db.get(Store, store_id)

    def get_qr_code(self, code_value: str) -> StoreQRCode | None:
        stmt = select(StoreQRCode).where(StoreQRCode.code_value == code_value, StoreQRCode.is_active.is_(True))
        return self.db.execute(stmt).scalar_one_or_none()

    def create(self, store: Store) -> Store:
        self.db.add(store)
        self.db.commit()
        self.db.refresh(store)
        return store

    def update(self, store: Store) -> Store:
        self.db.commit()
        self.db.refresh(store)
        return store
