"""
Prediction Service
──────────────────
Loads trained .pkl models at startup and exposes run_prediction().
Falls back to a transparent heuristic model when .pkl files are absent.
"""

import pickle
import numpy as np
from pathlib import Path
from typing import Dict, Optional, Tuple

from app.schemas.request_schema import HealthInput
from app.services.preprocessing_service import build_feature_vector
from app.utils.risk_utils import clamp
from app.utils.logger import logger


MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

MODEL_FILES = {
    "diabetes":     MODELS_DIR / "diabetes_model.pkl",
    "heart":        MODELS_DIR / "heart_model.pkl",
    "hypertension": MODELS_DIR / "hypertension_model.pkl",
}

_models: Dict[str, object] = {}


def load_models() -> None:
    """Load all .pkl models into memory. Called once at application startup."""
    for name, path in MODEL_FILES.items():
        if path.exists():
            try:
                with open(path, "rb") as f:
                    _models[name] = pickle.load(f)
                logger.info(f"Model loaded: {name}")
            except Exception as exc:
                logger.warning(f"Could not load {name} model ({exc}). Heuristic will be used.")
        else:
            logger.warning(f"Model file not found: {path} — heuristic fallback active.")


# ─── Heuristic fallbacks (used when .pkl is absent) ──────────────────────────

def _heuristic_diabetes(d: HealthInput) -> float:
    score = 0.05
    if d.glucose >= 126:                  score += 0.40
    elif d.glucose >= 100:                score += 0.20
    if d.bmi >= 30:                       score += 0.20
    elif d.bmi >= 25:                     score += 0.10
    if d.age >= 45:                       score += 0.10
    if d.family_history:                  score += 0.10
    if d.physical_activity == "low":      score += 0.08
    return clamp(score)


def _heuristic_heart(d: HealthInput) -> float:
    score = 0.05
    if d.cholesterol >= 240:              score += 0.25
    elif d.cholesterol >= 200:            score += 0.12
    if d.blood_pressure >= 140:           score += 0.25
    elif d.blood_pressure >= 130:         score += 0.12
    if d.smoking_status:                  score += 0.20
    if d.age >= 55:                       score += 0.12
    elif d.age >= 45:                     score += 0.07
    if d.family_history:                  score += 0.10
    return clamp(score)


def _heuristic_hypertension(d: HealthInput) -> float:
    score = 0.05
    if d.blood_pressure >= 140:           score += 0.40
    elif d.blood_pressure >= 130:         score += 0.20
    if d.bmi >= 30:                       score += 0.15
    if d.smoking_status:                  score += 0.10
    if d.age >= 50:                       score += 0.10
    if d.family_history:                  score += 0.10
    return clamp(score)


# ─── Inference helper ─────────────────────────────────────────────────────────

def _infer(model_name: str, features: np.ndarray) -> Optional[float]:
    model = _models.get(model_name)
    if model is None:
        return None
    try:
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(features)
            return clamp(float(proba[0][1]))
        else:
            val = model.predict(features)
            return clamp(float(val[0]))
    except Exception as exc:
        logger.error(f"Inference error [{model_name}]: {exc}")
        return None


# ─── Public API ───────────────────────────────────────────────────────────────

def run_prediction(data: HealthInput) -> Tuple[float, float, float]:
    """
    Returns (diabetes_risk, heart_disease_risk, hypertension_risk) as
    probability floats in [0, 1].
    """
    features = build_feature_vector(data)

    diabetes = _infer("diabetes", features)     or _heuristic_diabetes(data)
    heart    = _infer("heart", features)        or _heuristic_heart(data)
    hyper    = _infer("hypertension", features) or _heuristic_hypertension(data)

    return round(diabetes, 4), round(heart, 4), round(hyper, 4)
