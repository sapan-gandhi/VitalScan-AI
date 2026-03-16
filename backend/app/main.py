from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

from app.config.settings import get_settings
from app.routes import predict, history, health, auth
from app.services.prediction_service import load_models
from app.utils.logger import logger


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="VitalScan AI — Disease Risk Prediction API",
        description="AI-powered backend for early detection of chronic diseases.",
        version="2.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS — allow all origins in production (lock down after testing)
    origins = settings.cors_origins
    if settings.app_env == "production":
        origins = ["*"]

    app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

    prefix = "/api/v1"
    app.include_router(health.router,  tags=["System"])
    app.include_router(auth.router,    prefix=prefix, tags=["Auth"])
    app.include_router(predict.router, prefix=prefix, tags=["Prediction"])
    app.include_router(history.router, prefix=prefix, tags=["History"])

    @app.on_event("startup")
    async def startup_event():
        logger.info("Starting VitalScan AI backend v2.0…")
        load_models()
        logger.info(f"Environment: {settings.app_env}")
        logger.info(f"PORT: {os.environ.get('PORT', 8000)}")
        logger.info("Backend ready.")

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Internal server error", "detail": str(exc)},
        )

    @app.get("/", include_in_schema=False)
    async def root():
        return {
            "service": "VitalScan AI Backend v2.0",
            "status": "running",
            "docs": "/docs",
        }

    return app


app = create_app()
