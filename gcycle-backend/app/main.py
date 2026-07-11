import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.constants import ErrorCode
from app.core.exceptions import AppException
from app.core.logging import setup_logging
from app.core.response import error_response

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description="G-Cycle: 다회용기 QR 주문/반납/수거/리워드 순환 플랫폼 백엔드 API",
    version="1.0.0",
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=exc.message, code=exc.code, details=exc.details),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content=error_response(
            message="validation failed",
            code=ErrorCode.VALIDATION_ERROR.value,
            details=exc.errors(),
        ),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("unhandled exception on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content=error_response(message="internal server error", code=ErrorCode.INTERNAL_ERROR.value),
    )


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "env": settings.APP_ENV}


app.include_router(api_router, prefix=settings.API_V1_PREFIX)
