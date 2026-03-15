"""
POST /api/v1/predict
Accepts health parameters, runs ML inference, saves result to Supabase.
Optionally associates result with logged-in user via JWT.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.schemas.request_schema import HealthInput
from app.schemas.response_schema import PredictionResponse, PredictionData, ErrorResponse
from app.services.prediction_service import run_prediction
from app.services.recommendation_service import generate_recommendations
from app.services.supabase_service import save_prediction
from app.utils.risk_utils import compute_overall_risk
from app.utils.logger import logger

router = APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)


def get_optional_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> str:
    """Extract user_id from JWT if present — does NOT block unauthenticated requests."""
    if not credentials:
        return None
    try:
        from app.db.supabase_client import get_supabase_client
        client = get_supabase_client()
        response = client.auth.get_user(credentials.credentials)
        if response and response.user:
            return response.user.id
    except Exception:
        pass
    return None


@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Run disease risk prediction",
    responses={
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def predict(
    payload: HealthInput,
    user_id: str = Depends(get_optional_user_id),
):
    logger.info(f"Prediction | age={payload.age} bmi={payload.bmi} user={user_id or 'anon'}")

    try:
        diabetes_risk, heart_risk, hypertension_risk = run_prediction(payload)
        overall_risk   = compute_overall_risk(diabetes_risk, heart_risk, hypertension_risk)
        recommendations = generate_recommendations(payload, diabetes_risk, heart_risk, hypertension_risk)

        db_payload = {
            "age":                payload.age,
            "gender":             str(payload.gender),
            "height":             payload.height,
            "weight":             payload.weight,
            "bmi":                payload.bmi,
            "blood_pressure":     payload.blood_pressure,
            "glucose":            payload.glucose,
            "cholesterol":        payload.cholesterol,
            "smoking_status":     payload.smoking_status,
            "physical_activity":  str(payload.physical_activity),
            "family_history":     payload.family_history,
            "diabetes_risk":      diabetes_risk,
            "heart_disease_risk": heart_risk,
            "hypertension_risk":  hypertension_risk,
            "overall_risk_level": overall_risk,
            "recommendations":    recommendations,
        }
        if user_id:
            db_payload["user_id"] = user_id

        save_prediction(db_payload)

        return PredictionResponse(
            data=PredictionData(
                diabetes_risk=diabetes_risk,
                heart_disease_risk=heart_risk,
                hypertension_risk=hypertension_risk,
                overall_risk_level=overall_risk,
                recommendations=recommendations,
            )
        )

    except Exception as exc:
        logger.error(f"Prediction error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))
