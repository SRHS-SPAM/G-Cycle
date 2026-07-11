from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_store_owner
from app.core.exceptions import NotFoundError
from app.core.response import success_response
from app.db.session import get_db
from app.models.store import Store
from app.models.user import User
from app.repositories.store_repo import StoreRepository
from app.schemas.store import StoreCreate, StoreOut, StoreUpdate

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("")
def list_stores(db: Session = Depends(get_db)):
    stores = StoreRepository(db).list_active()
    return success_response([StoreOut.model_validate(s).model_dump() for s in stores], message="ok")


@router.get("/{store_id}")
def get_store(store_id: str, db: Session = Depends(get_db)):
    store = StoreRepository(db).get_by_id(store_id)
    if not store:
        raise NotFoundError("store not found")
    return success_response(StoreOut.model_validate(store).model_dump(), message="ok")


@router.post("")
def create_store(
    payload: StoreCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_store_owner),
):
    repo = StoreRepository(db)
    store = Store(owner_id=current_user.id, **payload.model_dump())
    store = repo.create(store)
    return success_response(StoreOut.model_validate(store).model_dump(), message="store created")


@router.patch("/{store_id}")
def update_store(
    store_id: str,
    payload: StoreUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_store_owner),
):
    repo = StoreRepository(db)
    store = repo.get_by_id(store_id)
    if not store:
        raise NotFoundError("store not found")
    if store.owner_id != current_user.id and current_user.role.value != "admin":
        from app.core.exceptions import ForbiddenError
        raise ForbiddenError("not allowed to modify this store")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(store, field, value)
    store = repo.update(store)
    return success_response(StoreOut.model_validate(store).model_dump(), message="store updated")
