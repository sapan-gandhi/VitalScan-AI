"""
Preprocessing Service
─────────────────────
Converts a HealthInput object into an ordered NumPy feature vector
that every ML model can consume directly.
"""

import numpy as np
from app.schemas.request_schema import HealthInput

GENDER_MAP   = {"male": 1, "female": 0, "other": 2}
ACTIVITY_MAP = {"low": 0, "moderate": 1, "high": 2}


def _bmi_category(bmi: float) -> int:
    if bmi < 18.5: return 0   # Underweight
    if bmi < 25.0: return 1   # Normal
    if bmi < 30.0: return 2   # Overweight
    return 3                   # Obese


def _bp_category(bp: float) -> int:
    if bp < 120: return 0     # Normal
    if bp < 130: return 1     # Elevated
    if bp < 140: return 2     # High Stage 1
    return 3                   # High Stage 2


def _glucose_category(g: float) -> int:
    if g < 100: return 0      # Normal
    if g < 126: return 1      # Pre-diabetic
    return 2                   # Diabetic range


def build_feature_vector(data: HealthInput) -> np.ndarray:
    """
    13-feature vector (shape 1×13):
      [age, gender, bmi, blood_pressure, glucose, cholesterol,
       smoking_status, physical_activity, family_history,
       bmi_category, bp_category, glucose_category, height]
    """
    vec = [
        float(data.age),
        float(GENDER_MAP.get(str(data.gender), 2)),
        float(data.bmi),
        float(data.blood_pressure),
        float(data.glucose),
        float(data.cholesterol),
        float(int(data.smoking_status)),
        float(ACTIVITY_MAP.get(str(data.physical_activity), 1)),
        float(int(data.family_history)),
        float(_bmi_category(data.bmi)),
        float(_bp_category(data.blood_pressure)),
        float(_glucose_category(data.glucose)),
        float(data.height),
    ]
    return np.array(vec, dtype=np.float64).reshape(1, -1)
