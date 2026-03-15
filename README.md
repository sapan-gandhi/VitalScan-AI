# VitalScan AI — Early Disease Risk Prediction System

<div align="center">

![VitalScan AI Banner](https://img.shields.io/badge/VitalScan-AI%20Health%20Platform-0e86e8?style=for-the-badge&logo=activity&logoColor=white)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5+-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![SDG](https://img.shields.io/badge/UN%20SDG-Goal%203%20%E2%9C%94-4CAF50?style=flat-square)](https://sdgs.un.org/goals/goal3)

**AI-powered early detection of chronic diseases — predict your risk before symptoms appear.**

[Live Demo](#) · [API Docs](http://localhost:8000/docs) · [Report Bug](https://github.com/sapan-gandhi/VitalScan-AI/issues) · [Request Feature](https://github.com/sapan-gandhi/VitalScan-AI/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Supabase Setup](#supabase-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [ML Models](#-ml-models)
- [Screenshots](#-screenshots)
- [SDG Alignment](#-sdg-alignment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🩺 Overview

**VitalScan AI** is a full-stack, production-grade health-tech web application that uses machine learning to predict a user's risk of developing chronic diseases — **before symptoms appear**.

Users enter their basic health parameters (age, BMI, glucose, blood pressure, cholesterol, lifestyle habits), and the AI engine instantly returns:

- 🔴 Disease risk probability scores for **5 conditions**
- 🎯 An animated **risk gauge meter** and visual charts
- 💊 Personalised **preventive recommendations**
- 📊 A **prediction history dashboard** tied to their account

> **Disclaimer:** VitalScan AI is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login via **Supabase Auth**
- JWT-based session management
- Protected routes — all prediction features require login
- Password strength meter on registration
- Email confirmation flow (configurable)

### 🤖 AI Prediction Engine
- Predicts risk for **5 chronic diseases**: Diabetes, Heart Disease, Hypertension, Stroke, Kidney Disease
- Uses trained **Random Forest** and **Gradient Boosting** models (94–95% test accuracy)
- Transparent heuristic fallback if model files are unavailable
- All predictions saved to Supabase with user association

### 📊 Visual Dashboard
- Animated **SVG gauge meter** with live needle animation
- **Radar chart** showing multi-disease risk profile
- **Bar chart** comparing all disease risks side-by-side
- Color-coded **risk cards** (Low 🟢 / Moderate 🟡 / High 🔴)
- Downloadable plain-text health report

### 💡 Recommendation Engine
- Rule-based engine with 15+ clinical rules
- Categorised advice: **Lifestyle**, **Diet**, **Medical**
- Priority levels: High / Suggested / Maintain

### 📁 Prediction History
- Full history table with date, risk scores, and overall category
- Search and filter by risk level
- Responsive table + mobile card view
- Stats: total assessments, low/moderate/high breakdown

### 🎨 UI/UX
- Premium healthcare startup design — **Syne + DM Sans** fonts
- Full **dark mode** toggle with persistence
- 4-step form wizard with progress bar and auto BMI calculation
- Fully **responsive** (desktop, tablet, mobile)
- Smooth animations and micro-interactions

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18.2+ | UI framework |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.4+ | Utility-first styling |
| React Router | 6.x | Client-side routing |
| Recharts | 2.12+ | Data visualisation charts |
| Lucide React | 0.344+ | Medical icon library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.10+ | Runtime |
| FastAPI | 0.111+ | REST API framework |
| Uvicorn | 0.29+ | ASGI server |
| scikit-learn | 1.5+ | ML model training & inference |
| Pandas / NumPy | Latest | Data preprocessing |
| Pydantic | 2.7+ | Request/response validation |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Supabase Auth | User authentication (register/login/JWT) |
| Supabase PostgreSQL | Prediction history storage |
| python-dotenv | Environment variable management |

---

## 📁 Project Structure

```
VitalScan-AI/
│
├── backend/                          # Python FastAPI backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app factory + CORS + startup
│   │   ├── config/
│   │   │   └── settings.py           # Pydantic settings (reads .env)
│   │   ├── routes/
│   │   │   ├── auth.py               # POST /register, POST /login, GET /me
│   │   │   ├── predict.py            # POST /predict
│   │   │   ├── history.py            # GET /history
│   │   │   └── health.py             # GET /health
│   │   ├── schemas/
│   │   │   ├── request_schema.py     # HealthInput Pydantic model + validation
│   │   │   └── response_schema.py    # Typed response models
│   │   ├── services/
│   │   │   ├── prediction_service.py     # ML inference + heuristic fallback
│   │   │   ├── preprocessing_service.py  # Feature engineering (13 features)
│   │   │   ├── recommendation_service.py # Rule-based recommendation engine
│   │   │   └── supabase_service.py       # DB read / write operations
│   │   ├── models/
│   │   │   ├── diabetes_model.pkl    # Trained RandomForest classifier
│   │   │   ├── heart_model.pkl       # Trained GradientBoosting classifier
│   │   │   └── hypertension_model.pkl # Trained RandomForest classifier
│   │   ├── utils/
│   │   │   ├── risk_utils.py         # Score → label helpers
│   │   │   └── logger.py             # Centralised structured logging
│   │   └── db/
│   │       └── supabase_client.py    # Singleton Supabase client
│   ├── train_models.py               # One-time model training script
│   ├── supabase_schema.sql           # Run in Supabase SQL Editor
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py                        # Development server launcher
│
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                   # Router with protected routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state (JWT + user)
│   │   ├── layouts/
│   │   │   ├── Layout.jsx            # Main layout (Navbar + Footer)
│   │   │   └── AuthLayout.jsx        # Auth pages layout (no navbar)
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page with hero section
│   │   │   ├── Login.jsx             # Split-screen login page
│   │   │   ├── Register.jsx          # Register with password strength meter
│   │   │   ├── InputForm.jsx         # 4-step health data wizard
│   │   │   ├── ResultsDashboard.jsx  # Full prediction results dashboard
│   │   │   └── History.jsx           # Prediction history with filters
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Responsive navbar + user dropdown
│   │   │   ├── Footer.jsx
│   │   │   ├── GaugeMeter.jsx        # Animated SVG risk gauge
│   │   │   ├── RiskCard.jsx          # Per-disease risk card with progress bar
│   │   │   ├── DiseaseChart.jsx      # Recharts bar + radar charts
│   │   │   ├── MetricCard.jsx        # Health metric display tile
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── HealthInputForm.jsx   # Multi-step form with validation
│   │   │   ├── HistoryTable.jsx      # Responsive table + mobile cards
│   │   │   ├── ProtectedRoute.jsx    # Auth guard component
│   │   │   └── LoadingSpinner.jsx
│   │   ├── services/
│   │   │   └── api.js                # All API calls + JWT headers
│   │   └── utils/
│   │       └── helpers.js            # BMI calc, risk labels, formatters
│   ├── .env                          # VITE_API_URL
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Included with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com) |

You also need a free **Supabase** account: [supabase.com](https://supabase.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/sapan-gandhi/VitalScan-AI.git
cd VitalScan-AI
```

---

### Backend Setup

#### Step 1 — Create & activate virtual environment

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

#### Step 2 — Install dependencies

```bash
pip install -r requirements.txt
```

#### Step 3 — Configure environment variables

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-service-role-key
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Step 4 — Train ML models

```bash
python train_models.py
```

This generates three trained model files in `app/models/`:
- `diabetes_model.pkl` — RandomForestClassifier (94% accuracy)
- `heart_model.pkl` — GradientBoostingClassifier (94% accuracy)
- `hypertension_model.pkl` — RandomForestClassifier (95% accuracy)

> The models are trained on 5,000 synthetic clinical records. Replace with real data for production.

#### Step 5 — Start the backend server

```bash
python run.py
```

Backend runs at **http://localhost:8000**

| URL | Description |
|-----|-------------|
| http://localhost:8000/docs | Interactive Swagger UI |
| http://localhost:8000/redoc | ReDoc documentation |
| http://localhost:8000/health | Health check |

---

### Frontend Setup

#### Step 1 — Install dependencies

```bash
cd frontend
npm install
```

#### Step 2 — Configure environment

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_MOCK=false
```

> Set `VITE_MOCK=true` to run the frontend with mock data without needing the backend running.

#### Step 3 — Start the development server

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

---

### Supabase Setup

#### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Name it `vitalscan-ai` and choose a region
4. Copy your **Project URL** and **service_role key** from `Settings → API`

#### Step 2 — Run the database schema

1. In your Supabase project, go to **SQL Editor → New Query**
2. Paste the contents of `backend/supabase_schema.sql`
3. Click **Run**

This creates the `prediction_history` table with all required columns, indexes, and RLS policies.

#### Step 3 — Configure Authentication

1. Go to **Authentication → Settings**
2. Set **Site URL** to `http://localhost:5173`
3. (For development) Turn **OFF** email confirmations under **Authentication → Email**

#### Step 4 — Database Schema Reference

```sql
CREATE TABLE prediction_history (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID        REFERENCES auth.users(id),
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
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_KEY` | ✅ | Your Supabase service role key |
| `APP_ENV` | ✅ | `development` or `production` |
| `APP_HOST` | ✅ | Server host (default: `0.0.0.0`) |
| `APP_PORT` | ✅ | Server port (default: `8000`) |
| `ALLOWED_ORIGINS` | ✅ | Comma-separated CORS origins |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL |
| `VITE_MOCK` | ❌ | Set `true` to use mock data |

---

## 📡 API Reference

### Authentication

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "full_name": "Sapan Gandhi",
  "email": "sapan@example.com",
  "password": "Secure@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "user": { "id": "uuid", "email": "sapan@example.com", "full_name": "Sapan Gandhi" },
  "access_token": "eyJ..."
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "sapan@example.com",
  "password": "Secure@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful!",
  "user": { "id": "uuid", "email": "sapan@example.com", "full_name": "Sapan Gandhi" },
  "access_token": "eyJ..."
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

---

### Prediction

#### Predict Disease Risk
```http
POST /api/v1/predict
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "age": 45,
  "gender": "male",
  "height": 172,
  "weight": 85,
  "bmi": 28.73,
  "blood_pressure": 135,
  "glucose": 115,
  "cholesterol": 210,
  "smoking_status": false,
  "physical_activity": "low",
  "family_history": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prediction generated successfully",
  "data": {
    "diabetes_risk": 0.4200,
    "heart_disease_risk": 0.5500,
    "hypertension_risk": 0.3800,
    "overall_risk_level": "Moderate",
    "recommendations": [
      "Reduce sugar and refined carbohydrate intake.",
      "Exercise for at least 30 minutes daily.",
      "Monitor cholesterol levels.",
      "Given your family history, schedule annual preventive health check-ups.",
      "Stay hydrated — drink at least 8 glasses of water daily."
    ]
  }
}
```

#### Get Prediction History
```http
GET /api/v1/history?limit=20&offset=0
Authorization: Bearer <access_token>
```

---

### System

#### Health Check
```http
GET /health
```
```json
{
  "status": "ok",
  "service": "AI Early Disease Risk Prediction Backend",
  "environment": "development"
}
```

---

## 🤖 ML Models

### Training Algorithm

| Disease | Algorithm | Test Accuracy | Features Used |
|---------|-----------|--------------|---------------|
| Diabetes | RandomForestClassifier (200 trees) | **94%** | Glucose, BMI, Age, Family History, Activity |
| Heart Disease | GradientBoostingClassifier (150 trees) | **94%** | Cholesterol, BP, Smoking, Age, Family History |
| Hypertension | RandomForestClassifier (200 trees) | **95%** | Blood Pressure, BMI, Smoking, Age |

### Feature Engineering (13 Features)

```
[age, gender, bmi, blood_pressure, glucose, cholesterol,
 smoking_status, physical_activity, family_history,
 bmi_category, bp_category, glucose_category, height]
```

### Risk Score Mapping

| Probability Score | Risk Level |
|------------------|------------|
| 0.00 – 0.30 | 🟢 Low |
| 0.31 – 0.60 | 🟡 Moderate |
| 0.61 – 1.00 | 🔴 High |

**Overall risk logic:**
- Any single disease score > 0.60 → **High**
- Any single disease score > 0.30 → **Moderate**
- All scores ≤ 0.30 → **Low**

---

## 🌐 SDG Alignment

<div align="center">

| Goal | Target | How VitalScan AI Contributes |
|------|--------|------------------------------|
| **SDG 3** — Good Health & Well-Being | 3.4 — Reduce premature mortality from NCDs | Early detection of Diabetes, Heart Disease, Hypertension |
| **SDG 3** — Good Health & Well-Being | 3.8 — Universal health coverage | Free, accessible AI health screening for everyone |
| **SDG 9** — Industry, Innovation & Infrastructure | 9.b — Support technology development | Open-source AI health tech for developing nations |

</div>

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a **Pull Request**

### Development Guidelines
- Follow existing code style and folder structure
- Add comments only where logic is non-obvious
- Test API changes in the Swagger UI (`/docs`) before submitting
- Keep PRs focused — one feature or fix per PR

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- Email rate limit on Supabase free plan (2 emails/hour) — disable email confirmation for development
- Models trained on synthetic data — replace with real clinical datasets for production accuracy

### Planned Features
- [ ] PDF report download (instead of plain text)
- [ ] User profile page with health history graphs
- [ ] Doctor consultation booking integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Hindi, Gujarati)
- [ ] Real clinical dataset integration (PIMA, Cleveland Heart)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 👤 Author

**Sapan Gandhi**

[![GitHub](https://img.shields.io/badge/GitHub-sapan--gandhi-181717?style=flat-square&logo=github)](https://github.com/sapan-gandhi)

---

## 🙏 Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com) — for the blazing-fast Python API framework
- [Supabase](https://supabase.com) — for the open-source Firebase alternative
- [scikit-learn](https://scikit-learn.org) — for the machine learning toolkit
- [Recharts](https://recharts.org) — for the composable React charting library
- [Lucide](https://lucide.dev) — for the beautiful icon set
- [Tailwind CSS](https://tailwindcss.com) — for utility-first CSS
- [UN SDG Goal 3](https://sdgs.un.org/goals/goal3) — Good Health & Well-Being

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for better health outcomes · Supporting UN SDG Goal 3

</div>
