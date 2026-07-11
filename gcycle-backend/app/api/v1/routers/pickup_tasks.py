from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import require_admin, require_rider
from app.core.response import success_response
from app.db.session import get_db
from app.models.user import User
from app.schemas.pickup_task import PickupTaskCompleteRequest, PickupTaskCreate, PickupTaskOut
from app.services.pickup_service import PickupService

router = APIRouter(prefix="/pickup-tasks", tags=["pickup-tasks"])


@router.post("")
def create_task(
    payload: PickupTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = PickupService(db)
    task = service.create_task(payload)
    return success_response(PickupTaskOut.model_validate(task).model_dump(), message="pickup task created")


@router.get("")
def list_tasks(db: Session = Depends(get_db), current_user: User = Depends(require_rider)):
    service = PickupService(db)
    if current_user.role.value == "admin":
        tasks = service.list_open_tasks()
    else:
        tasks = service.list_open_tasks() + service.list_my_tasks(current_user.id)
    return success_response([PickupTaskOut.model_validate(t).model_dump() for t in tasks], message="ok")


@router.get("/{pickup_task_id}")
def get_task(pickup_task_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_rider)):
    service = PickupService(db)
    task = service.get_task(pickup_task_id)
    return success_response(PickupTaskOut.model_validate(task).model_dump(), message="ok")


@router.patch("/{pickup_task_id}/accept")
def accept_task(pickup_task_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_rider)):
    service = PickupService(db)
    task = service.accept_task(pickup_task_id, current_user.id)
    return success_response(PickupTaskOut.model_validate(task).model_dump(), message="pickup task accepted")


@router.patch("/{pickup_task_id}/complete")
def complete_task(
    pickup_task_id: str,
    payload: PickupTaskCompleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_rider),
):
    service = PickupService(db)
    task = service.complete_task(pickup_task_id, current_user.id, payload.collected_count)
    return success_response(PickupTaskOut.model_validate(task).model_dump(), message="pickup task completed")
