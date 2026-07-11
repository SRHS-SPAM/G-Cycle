from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.core.response import success_response
from app.db.session import get_db
from app.models.user import User
from app.schemas.container import ContainerOut, ContainerScanRequest
from app.services.container_service import ContainerService

router = APIRouter(prefix="/containers", tags=["containers"])


@router.post("/scan")
def scan_container(
    payload: ContainerScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ContainerService(db)
    container = service.scan(current_user.id, payload)
    return success_response(ContainerOut.model_validate(container).model_dump(), message="container scanned")


@router.get("/me")
def list_my_containers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = ContainerService(db)
    containers = service.list_my_containers(current_user.id)
    return success_response([ContainerOut.model_validate(c).model_dump() for c in containers], message="ok")


@router.get("/{container_id}")
def get_container(container_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = ContainerService(db)
    container = service.get_container(container_id)
    return success_response(ContainerOut.model_validate(container).model_dump(), message="ok")
