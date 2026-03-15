"""
Shared helpers for converting raw probability scores into
human-readable risk labels and overall risk levels.
"""

from typing import Dict


# ─── Thresholds ───────────────────────────────────────────────────────────────
LOW_THRESHOLD = 0.30
HIGH_THRESHOLD = 0.60


def score_to_label(score: float) -> str:
    """Convert a 0-1 probability to Low / Moderate / High."""
    if score <= LOW_THRESHOLD:
        return "Low"
    elif score <= HIGH_THRESHOLD:
        return "Moderate"
    return "High"


def compute_overall_risk(
    diabetes: float,
    heart: float,
    hypertension: float,
) -> str:
    """
    Derive an overall risk level from three disease scores.

    Rules:
      - Any score > 0.60  → High
      - Any score > 0.30  → Moderate
      - Otherwise         → Low
    """
    scores = [diabetes, heart, hypertension]
    if any(s > HIGH_THRESHOLD for s in scores):
        return "High"
    if any(s > LOW_THRESHOLD for s in scores):
        return "Moderate"
    return "Low"


def clamp(value: float, lo: float = 0.0, hi: float = 1.0) -> float:
    """Clamp a probability to [0, 1]."""
    return max(lo, min(hi, value))
