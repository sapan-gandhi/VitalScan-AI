// services/api.js — All API calls in one place
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const getToken = () => localStorage.getItem('vs_token')

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    const msg = data?.detail || data?.message || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return data
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body)  => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body)  => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  logout:   ()      => request('/auth/logout',   { method: 'POST' }),
  getMe:    (token) => request('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
}

// ── Predictions ───────────────────────────────────────────────────────────────
export async function predictDisease(formData) {
  // Mock mode — remove this block when backend is running
  if (import.meta.env.VITE_MOCK === 'true') {
    await new Promise(r => setTimeout(r, 2000))
    return mockPredict(formData)
  }
  return request('/predict', { method: 'POST', body: JSON.stringify(formData) })
}

export async function getPredictionHistory() {
  if (import.meta.env.VITE_MOCK === 'true') {
    await new Promise(r => setTimeout(r, 600))
    return { data: mockHistory() }
  }
  return request('/history')
}

// ── Mock helpers (fallback if backend not running) ────────────────────────────
function mockPredict(data) {
  const age = Number(data.age) || 40
  const bmi = Number(data.bmi) || 25
  const glucose = Number(data.glucose) || 90
  const cholesterol = Number(data.cholesterol) || 180
  const bp = Number(data.systolic || data.blood_pressure) || 120
  const smoking = data.smoking === 'current' || data.smoking_status === true ? 1 : 0
  const activity = data.activity === 'sedentary' || data.physical_activity === 'low' ? 1 : 0
  const family = data.familyHistory || data.family_history ? 1 : 0

  const clamp = v => Math.max(0.05, Math.min(0.95, v))
  const diabetes    = clamp(((glucose - 70) / 250 + (bmi - 18) / 60 + smoking * 0.08 + age * 0.004 + family * 0.1))
  const heart       = clamp(((cholesterol - 150) / 400 + (bp - 100) / 200 + smoking * 0.15 + age * 0.005 + family * 0.1))
  const hypertension = clamp(((bp - 100) / 200 + (bmi - 18) / 80 + smoking * 0.1 + age * 0.004 + family * 0.1))

  const scores = [diabetes, heart, hypertension]
  const overall = scores.some(s => s > 0.6) ? 'High' : scores.some(s => s > 0.3) ? 'Moderate' : 'Low'
  const avg = Math.round(scores.reduce((a,b)=>a+b,0) / 3 * 100)

  return {
    success: true,
    data: {
      diabetes_risk:      Math.round(diabetes * 100) / 100,
      heart_disease_risk: Math.round(heart * 100) / 100,
      hypertension_risk:  Math.round(hypertension * 100) / 100,
      overall_risk_level: overall,
      recommendations: [
        glucose > 100  ? 'Monitor blood glucose levels regularly.' : null,
        bmi > 25       ? 'Maintain a healthy body weight.' : null,
        smoking        ? 'Quit smoking to significantly reduce cardiovascular risk.' : null,
        activity       ? 'Exercise for at least 30 minutes daily.' : null,
        family         ? 'Schedule annual preventive health check-ups.' : null,
        'Stay hydrated — drink at least 8 glasses of water daily.',
        'Consult a healthcare professional if any symptoms persist.',
      ].filter(Boolean),
    },
    // Also expose flat structure so ResultsDashboard can adapt
    risks: {
      diabetes:     Math.round(diabetes * 100),
      heart:        Math.round(heart * 100),
      hypertension: Math.round(hypertension * 100),
      stroke:       Math.round(heart * 70),
      kidney:       Math.round(hypertension * 60),
    },
    overall: overall,
    overallScore: avg,
    timestamp: new Date().toISOString(),
    inputSummary: {
      age: data.age,
      bmi: Number(data.bmi || bmi).toFixed(1),
      glucose: data.glucose,
      cholesterol: data.cholesterol,
      bloodPressure: `${data.systolic || data.blood_pressure}/${data.diastolic || 80}`,
    },
    recommendations: [
      glucose > 100  ? 'Monitor blood glucose levels regularly.' : null,
      bmi > 25       ? 'Maintain a healthy body weight.' : null,
      smoking        ? 'Quit smoking to significantly reduce cardiovascular risk.' : null,
      activity       ? 'Exercise for at least 30 minutes daily.' : null,
      family         ? 'Schedule annual preventive health check-ups.' : null,
      'Stay hydrated — drink at least 8 glasses of water daily.',
      'Consult a healthcare professional if any symptoms persist.',
    ].filter(Boolean),
  }
}

function mockHistory() {
  return [
    { id:'1', timestamp:'2025-03-10T09:22:00Z', risks:{diabetes:32,heart:45,hypertension:28,stroke:20,kidney:18}, overall:'Moderate', overallScore:29 },
    { id:'2', timestamp:'2025-02-15T14:05:00Z', risks:{diabetes:22,heart:38,hypertension:24,stroke:16,kidney:14}, overall:'Low',      overallScore:23 },
    { id:'3', timestamp:'2025-01-08T11:30:00Z', risks:{diabetes:58,heart:62,hypertension:54,stroke:40,kidney:35}, overall:'High',     overallScore:50 },
  ]
}
