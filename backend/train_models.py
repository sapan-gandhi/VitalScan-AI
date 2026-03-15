"""
train_models.py
───────────────
Generates and saves trained scikit-learn models to app/models/.

Run this ONCE before starting the server:
    python train_models.py

Uses synthetic data that mirrors real-world clinical distributions.
Replace with your own dataset for production accuracy.

Models trained:
  • RandomForestClassifier → diabetes_model.pkl
  • GradientBoostingClassifier → heart_model.pkl
  • RandomForestClassifier → hypertension_model.pkl
"""

import os
import pickle
import numpy as np
import warnings
from pathlib import Path

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

warnings.filterwarnings("ignore")

# ─── Config ───────────────────────────────────────────────────────────────────
MODELS_DIR  = Path("app/models")
N_SAMPLES   = 5000
RANDOM_SEED = 42

MODELS_DIR.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(RANDOM_SEED)


# ─── Feature generation ───────────────────────────────────────────────────────
# Feature order must match preprocessing_service.build_feature_vector():
#   [age, gender, bmi, blood_pressure, glucose, cholesterol,
#    smoking, activity, family_history, bmi_cat, bp_cat, glucose_cat, height]

def make_dataset(n: int):
    age             = rng.integers(18, 80, n).astype(float)
    gender          = rng.integers(0, 3, n).astype(float)         # 0=F,1=M,2=Other
    bmi             = rng.normal(26, 5, n).clip(15, 50)
    blood_pressure  = rng.normal(120, 18, n).clip(70, 200)
    glucose         = rng.normal(100, 25, n).clip(60, 300)
    cholesterol     = rng.normal(190, 40, n).clip(100, 400)
    smoking         = rng.integers(0, 2, n).astype(float)
    activity        = rng.integers(0, 3, n).astype(float)         # 0=low,1=mod,2=high
    family_history  = rng.integers(0, 2, n).astype(float)
    height          = rng.normal(168, 10, n).clip(140, 210)

    # Derived categorical features
    bmi_cat = np.where(bmi < 18.5, 0, np.where(bmi < 25, 1, np.where(bmi < 30, 2, 3))).astype(float)
    bp_cat  = np.where(blood_pressure < 120, 0, np.where(blood_pressure < 130, 1,
              np.where(blood_pressure < 140, 2, 3))).astype(float)
    gluc_cat = np.where(glucose < 100, 0, np.where(glucose < 126, 1, 2)).astype(float)

    X = np.column_stack([
        age, gender, bmi, blood_pressure, glucose, cholesterol,
        smoking, activity, family_history, bmi_cat, bp_cat, gluc_cat, height,
    ])
    return X, age, bmi, blood_pressure, glucose, cholesterol, smoking, activity, family_history


X, age, bmi, blood_pressure, glucose, cholesterol, smoking, activity, family_history = make_dataset(N_SAMPLES)


# ─── Label generation (clinically-inspired rules + noise) ────────────────────

def noisy(arr, flip_prob=0.05):
    """Randomly flip a fraction of labels to simulate real-world noise."""
    mask = rng.random(len(arr)) < flip_prob
    return np.where(mask, 1 - arr, arr)


y_diabetes = noisy((
    (glucose >= 126).astype(int) * 3 +
    (glucose >= 100).astype(int) +
    (bmi >= 30).astype(int) * 2 +
    (bmi >= 25).astype(int) +
    (age >= 45).astype(int) +
    (family_history == 1).astype(int) +
    (activity == 0).astype(int)
) >= 4)

y_heart = noisy((
    (cholesterol >= 240).astype(int) * 2 +
    (cholesterol >= 200).astype(int) +
    (blood_pressure >= 140).astype(int) * 2 +
    (blood_pressure >= 130).astype(int) +
    (smoking == 1).astype(int) * 2 +
    (age >= 55).astype(int) * 2 +
    (age >= 45).astype(int) +
    (family_history == 1).astype(int)
) >= 5)

y_hypertension = noisy((
    (blood_pressure >= 140).astype(int) * 3 +
    (blood_pressure >= 130).astype(int) +
    (bmi >= 30).astype(int) * 2 +
    (smoking == 1).astype(int) +
    (age >= 50).astype(int) * 2 +
    (family_history == 1).astype(int)
) >= 4)

DATASETS = {
    "diabetes":     (X, y_diabetes.astype(int)),
    "heart":        (X, y_heart.astype(int)),
    "hypertension": (X, y_hypertension.astype(int)),
}

ESTIMATORS = {
    "diabetes":     RandomForestClassifier(n_estimators=200, max_depth=8, random_state=RANDOM_SEED),
    "heart":        GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, max_depth=5, random_state=RANDOM_SEED),
    "hypertension": RandomForestClassifier(n_estimators=200, max_depth=8, random_state=RANDOM_SEED),
}


# ─── Train + save ─────────────────────────────────────────────────────────────

for name, (features, labels) in DATASETS.items():
    print(f"\n{'─'*50}")
    print(f"Training {name.upper()} model…")

    X_train, X_test, y_train, y_test = train_test_split(
        features, labels, test_size=0.2, random_state=RANDOM_SEED, stratify=labels
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("clf",    ESTIMATORS[name]),
    ])

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    print(classification_report(y_test, y_pred, target_names=["Negative", "Positive"]))

    out_path = MODELS_DIR / f"{name}_model.pkl"
    with open(out_path, "wb") as f:
        pickle.dump(pipeline, f)

    print(f"✓ Saved → {out_path}")

print(f"\n{'─'*50}")
print("All models trained and saved to app/models/")
print("You can now start the backend with:  python run.py")
