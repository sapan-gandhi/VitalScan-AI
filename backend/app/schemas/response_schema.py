"""
Pydantic response schemas.
Provides consistent, typed API responses for all endpoints.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime


# ─── Prediction ───────────────────────────────────────────────────────────────

class PredictionData(BaseModel):
    diabetes_risk: float = Field(..., ge=0, le=1)
    heart_disease_risk: float = Field(..., ge=0, le=1)
    hypertension_risk: float = Field(..., ge=0, le=1)
    overall_risk_level: str
    recommendations: List[str]


class PredictionResponse(BaseModel):
    success: bool = True
    message: str = "Prediction generated successfully"
    data: PredictionData


# ─── History ──────────────────────────────────────────────────────────────────

class HistoryRecord(BaseModel):
    id: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[float] = None
    blood_pressure: Optional[float] = None
    glucose: Optional[float] = None
    cholesterol: Optional[float] = None
    smoking_status: Optional[bool] = None
    physical_activity: Optional[str] = None
    family_history: Optional[bool] = None
    diabetes_risk: Optional[float] = None
    heart_disease_risk: Optional[float] = None
    hypertension_risk: Optional[float] = None
    overall_risk_level: Optional[str] = None
    recommendations: Optional[List[str]] = None
    created_at: Optional[datetime] = None


class HistoryResponse(BaseModel):
    success: bool = True
    message: str = "History retrieved successfully"
    count: int
    data: List[HistoryRecord]


# ─── Health check ─────────────────────────────────────────────────────────────

class HealthCheckResponse(BaseModel):
    status: str = "ok"
    service: str = "AI Early Disease Risk Prediction Backend"
    environment: Optional[str] = None


# ─── Generic error ────────────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    detail: Optional[Any] = None
