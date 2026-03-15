"""
GET /health
───────────
Lightweight health-check endpoint for load balancers and uptime monitors.
"""

from fastapi import APIRouter
from app.schemas.response_schema import HealthCheckResponse
from app.config.settings import get_settings

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Health check",
    description="Returns service status. Use this to verify the API is running.",
)
async def health_check():
    settings = get_settings()
    return HealthCheckResponse(
        status="ok",
        service="AI Early Disease Risk Prediction Backend",
        environment=settings.app_env,
    )
