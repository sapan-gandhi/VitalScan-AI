"""
Pydantic request schema for the /predict endpoint.
All validation rules live here — routes stay clean.
"""

from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional
from enum import Enum


class PhysicalActivity(str, Enum):
    low = "low"
    moderate = "moderate"
    high = "high"


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class HealthInput(BaseModel):
    # ── Demographics ──────────────────────────────────────────────────────────
    age: int = Field(..., ge=1, le=120, description="Age in years (1–120)")
    gender: Gender = Field(..., description="Gender: male | female | other")

    # ── Physical measurements ─────────────────────────────────────────────────
    height: float = Field(..., gt=0, le=300, description="Height in cm")
    weight: float = Field(..., gt=0, le=500, description="Weight in kg")
    bmi: Optional[float] = Field(
        None, gt=0, le=100, description="Body Mass Index (auto-calculated if omitted)"
    )

    # ── Vitals ────────────────────────────────────────────────────────────────
    blood_pressure: float = Field(
        ..., ge=50, le=300, description="Systolic blood pressure in mmHg"
    )
    glucose: float = Field(
        ..., ge=30, le=700, description="Fasting blood glucose in mg/dL"
    )
    cholesterol: float = Field(
        ..., ge=50, le=700, description="Total cholesterol in mg/dL"
    )

    # ── Lifestyle ─────────────────────────────────────────────────────────────
    smoking_status: bool = Field(..., description="Current smoker: true | false")
    physical_activity: PhysicalActivity = Field(
        ..., description="Activity level: low | moderate | high"
    )
    family_history: bool = Field(
        ..., description="Family history of chronic disease: true | false"
    )

    # ── Auto-calculate BMI if not provided ────────────────────────────────────
    @model_validator(mode="after")
    def calculate_bmi_if_missing(self) -> "HealthInput":
        if self.bmi is None and self.height and self.weight:
            height_m = self.height / 100
            self.bmi = round(self.weight / (height_m ** 2), 2)
        return self

    class Config:
        # Accept both enum value strings and raw strings from JSON
        use_enum_values = True

        json_schema_extra = {
            "example": {
                "age": 45,
                "gender": "male",
                "height": 172,
                "weight": 85,
                "bmi": 28.73,
                "blood_pressure": 135,
                "glucose": 115,
                "cholesterol": 210,
                "smoking_status": False,
                "physical_activity": "low",
                "family_history": True,
            }
        }
