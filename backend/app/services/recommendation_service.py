"""
Recommendation Service
──────────────────────
Pure rule-based engine: takes risk scores + raw health input
and returns a deduplicated, prioritised list of recommendations.
"""

from typing import List
from app.schemas.request_schema import HealthInput


def generate_recommendations(
    data: HealthInput,
    diabetes_risk: float,
    heart_risk: float,
    hypertension_risk: float,
) -> List[str]:
    """
    Return a list of plain-English preventive recommendations.
    Rules are evaluated in priority order; duplicates are removed.
    """
    recs: List[str] = []

    # ── Diabetes ──────────────────────────────────────────────────────────────
    if diabetes_risk > 0.60:
        recs.append("Consult a physician immediately for diabetes screening (HbA1c test).")
        recs.append("Strictly limit added sugars, refined carbohydrates, and sweetened beverages.")
        recs.append("Monitor fasting blood glucose levels weekly.")
    elif diabetes_risk > 0.40:
        recs.append("Reduce sugar and refined carbohydrate intake.")
        recs.append("Monitor blood glucose levels regularly.")
    elif diabetes_risk > 0.30:
        recs.append("Be mindful of sugar intake and maintain a balanced diet.")

    # ── Heart disease ─────────────────────────────────────────────────────────
    if heart_risk > 0.60:
        recs.append("Seek immediate cardiovascular evaluation from a cardiologist.")
        recs.append("Adopt a heart-healthy diet: reduce saturated fats and processed foods.")
        recs.append("Monitor cholesterol and triglyceride levels every 3 months.")
    elif heart_risk > 0.40:
        recs.append("Exercise for at least 30 minutes daily (brisk walking, cycling, or swimming).")
        recs.append("Monitor cholesterol levels and discuss statin therapy with your doctor.")
    elif heart_risk > 0.30:
        recs.append("Include omega-3-rich foods (fish, flaxseed) in your diet.")

    # ── Hypertension ──────────────────────────────────────────────────────────
    if hypertension_risk > 0.60:
        recs.append("Seek medical evaluation for hypertension management immediately.")
        recs.append("Strictly reduce sodium intake to below 1,500 mg per day.")
        recs.append("Track blood pressure twice daily and share logs with your doctor.")
    elif hypertension_risk > 0.40:
        recs.append("Reduce salt and processed food intake to manage blood pressure.")
        recs.append("Track blood pressure frequently — aim below 120/80 mmHg.")
    elif hypertension_risk > 0.30:
        recs.append("Adopt the DASH diet to help keep blood pressure in a healthy range.")

    # ── BMI / Weight ──────────────────────────────────────────────────────────
    if data.bmi >= 30:
        recs.append("Work towards a healthy BMI (18.5–24.9) through diet and structured exercise.")
        recs.append("Consider consulting a nutritionist for a personalised weight-loss plan.")
    elif data.bmi >= 25:
        recs.append("Maintain a healthy body weight — a 5–10% reduction significantly lowers disease risk.")

    # ── Smoking ───────────────────────────────────────────────────────────────
    if data.smoking_status:
        recs.append("Quit smoking — it is the single most impactful change for cardiovascular health.")
        recs.append("Explore nicotine replacement therapy or smoking cessation programmes.")

    # ── Physical activity ─────────────────────────────────────────────────────
    if data.physical_activity == "low":
        recs.append("Aim for at least 150 minutes of moderate aerobic activity per week.")
        recs.append("Start with short 10-minute walks and gradually increase duration.")
    elif data.physical_activity == "moderate":
        recs.append("Consider adding strength training twice a week alongside cardio.")

    # ── Glucose ───────────────────────────────────────────────────────────────
    if data.glucose >= 126:
        recs.append("Your fasting glucose is in the diabetic range — consult a doctor urgently.")
    elif data.glucose >= 100:
        recs.append("Pre-diabetic glucose detected — dietary changes and exercise can reverse this.")

    # ── Cholesterol ───────────────────────────────────────────────────────────
    if data.cholesterol >= 240:
        recs.append("High cholesterol detected — schedule a lipid panel with your healthcare provider.")
    elif data.cholesterol >= 200:
        recs.append("Borderline-high cholesterol — reduce saturated fat and increase fibre intake.")

    # ── Blood pressure ────────────────────────────────────────────────────────
    if data.blood_pressure >= 140:
        recs.append("Your blood pressure is in the hypertensive range — medical consultation is advised.")
    elif data.blood_pressure >= 130:
        recs.append("Elevated blood pressure detected — reduce stress and sodium intake.")

    # ── Family history ────────────────────────────────────────────────────────
    if data.family_history:
        recs.append("Given your family history, schedule annual preventive health check-ups.")

    # ── Universal baseline ────────────────────────────────────────────────────
    recs.append("Stay hydrated — drink at least 8 glasses of water daily.")
    recs.append("Prioritise 7–8 hours of quality sleep each night.")
    recs.append("Consult a healthcare professional if any symptoms persist or worsen.")

    # Deduplicate while preserving order
    seen = set()
    unique_recs = []
    for r in recs:
        if r not in seen:
            seen.add(r)
            unique_recs.append(r)

    return unique_recs
