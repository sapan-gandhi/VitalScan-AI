-- VitalScan AI v2.0 — Full Schema (run in Supabase SQL Editor)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop if re-running
DROP TABLE IF EXISTS prediction_history;

CREATE TABLE prediction_history (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    age                 INTEGER,
    gender              TEXT,
    height              FLOAT,
    weight              FLOAT,
    bmi                 FLOAT,
    blood_pressure      FLOAT,
    glucose             FLOAT,
    cholesterol         FLOAT,
    smoking_status      BOOLEAN     DEFAULT FALSE,
    physical_activity   TEXT,
    family_history      BOOLEAN     DEFAULT FALSE,
    diabetes_risk       FLOAT,
    heart_disease_risk  FLOAT,
    hypertension_risk   FLOAT,
    overall_risk_level  TEXT,
    recommendations     JSONB       DEFAULT '[]'::jsonb,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ph_created_at ON prediction_history (created_at DESC);
CREATE INDEX idx_ph_user_id    ON prediction_history (user_id);
CREATE INDEX idx_ph_risk_level ON prediction_history (overall_risk_level);

-- Disable RLS for easy demo access (re-enable + add policies for production)
ALTER TABLE prediction_history DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT 'Table prediction_history created successfully' AS status;
