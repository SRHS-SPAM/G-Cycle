from datetime import datetime, timezone
from typing import Any, Generic, TypeVar
from uuid import uuid4

from pydantic import BaseModel

T = TypeVar("T")


class Meta(BaseModel):
    timestamp: str
    request_id: str

    @classmethod
    def new(cls) -> "Meta":
        return cls(timestamp=datetime.now(timezone.utc).isoformat(), request_id=uuid4().hex[:12])


class ErrorDetail(BaseModel):
    code: str
    details: list[Any] = []


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "ok"
    data: T | None = None
    error: ErrorDetail | None = None
    meta: Meta = None  # type: ignore[assignment]

    def __init__(self, **data: Any) -> None:
        if "meta" not in data or data["meta"] is None:
            data["meta"] = Meta.new()
        super().__init__(**data)


def success_response(data: Any = None, message: str = "ok") -> dict:
    return ApiResponse(success=True, message=message, data=data, error=None).model_dump()


def error_response(message: str, code: str, details: list[Any] | None = None) -> dict:
    return ApiResponse(
        success=False,
        message=message,
        data=None,
        error=ErrorDetail(code=code, details=details or []),
    ).model_dump()
