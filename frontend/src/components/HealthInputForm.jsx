import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Droplets, Heart, Activity,
  ChevronRight, AlertCircle, TrendingUp
} from 'lucide-react'
import { calculateBMI, getBMICategory } from '../utils/helpers'
import { predictDisease } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const FIELD_GROUPS = [
  { id: 'personal',  title: 'Personal Information',  icon: User,     color: 'azure' },
  { id: 'vitals',    title: 'Vital Measurements',     icon: Activity, color: 'mint'  },
  { id: 'labs',      title: 'Lab Results',            icon: Droplets, color: 'coral' },
  { id: 'lifestyle', title: 'Lifestyle & History',    icon: Heart,    color: 'amber' },
]

const FAMILY_HISTORY_OPTIONS = [
  'Diabetes', 'Heart Disease', 'Hypertension', 'Stroke', 'Kidney Disease', 'Cancer'
]

// Map form activity value → backend expected value
const ACTIVITY_MAP = {
  sedentary: 'low',
  light:     'low',
  moderate:  'moderate',
  active:    'high',
}

export default function HealthInputForm({ setPredictionResult }) {
  const { token } = useAuth()
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [step,    setStep]    = useState(0)
  const [form,    setForm]    = useState({
    age: '', gender: '',
    height: '', weight: '', bmi: '',
    systolic: '', diastolic: '',
    glucose: '', cholesterol: '',
    smoking: '', activity: '',
    familyHistory: [],
  })

  // Auto-calc BMI
  useEffect(() => {
    if (form.height && form.weight) {
      const bmi = calculateBMI(Number(form.weight), Number(form.height))
      setForm(f => ({ ...f, bmi }))
    }
  }, [form.height, form.weight])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const handleFamilyHistory = item => {
    setForm(f => ({
      ...f,
      familyHistory: f.familyHistory.includes(item)
        ? f.familyHistory.filter(x => x !== item)
        : [...f.familyHistory, item],
    }))
  }

  const validateStep = s => {
    const errs = {}
    if (s === 0) {
      if (!form.age || form.age < 1 || form.age > 120) errs.age = 'Enter valid age (1–120)'
      if (!form.gender) errs.gender = 'Select gender'
    }
    if (s === 1) {
      if (!form.height   || form.height < 50   || form.height > 250)   errs.height   = 'Enter valid height (50–250 cm)'
      if (!form.weight   || form.weight < 10   || form.weight > 300)   errs.weight   = 'Enter valid weight (10–300 kg)'
      if (!form.systolic || form.systolic < 60 || form.systolic > 250) errs.systolic = 'Enter valid systolic (60–250)'
      if (!form.diastolic|| form.diastolic< 40 || form.diastolic> 150) errs.diastolic= 'Enter valid diastolic (40–150)'
    }
    if (s === 2) {
      if (!form.glucose     || form.glucose < 50     || form.glucose > 600)     errs.glucose     = 'Enter valid glucose (50–600 mg/dL)'
      if (!form.cholesterol || form.cholesterol < 50 || form.cholesterol > 600) errs.cholesterol = 'Enter valid cholesterol (50–600 mg/dL)'
    }
    if (s === 3) {
      if (!form.smoking)  errs.smoking  = 'Select smoking status'
      if (!form.activity) errs.activity = 'Select activity level'
    }
    return errs
  }

  const nextStep = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(s => s + 1)
  }

  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validateStep(3)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      // ── Transform form → exact backend schema ─────────────────────────────
      const payload = {
        age:               Number(form.age),
        gender:            form.gender.toLowerCase(),          // "male"/"female"/"other"
        height:            Number(form.height),
        weight:            Number(form.weight),
        bmi:               Number(form.bmi),
        blood_pressure:    Number(form.systolic),              // backend expects systolic
        glucose:           Number(form.glucose),
        cholesterol:       Number(form.cholesterol),
        smoking_status:    form.smoking === 'current' || form.smoking === 'occasional', // boolean
        physical_activity: ACTIVITY_MAP[form.activity] || 'moderate',  // "low"/"moderate"/"high"
        family_history:    form.familyHistory.length > 0,      // boolean
      }

      const result = await predictDisease(payload)

      // ── Attach input summary so dashboard can show it ─────────────────────
      result.inputSummary = {
        age:          form.age,
        bmi:          Number(form.bmi).toFixed(1),
        glucose:      form.glucose,
        cholesterol:  form.cholesterol,
        bloodPressure:`${form.systolic}/${form.diastolic}`,
      }
      result.timestamp = result.timestamp || new Date().toISOString()

      // ── Normalise backend response for dashboard ──────────────────────────
      // Backend returns: { success, data: { diabetes_risk: 0.42, ... } }
      if (result.data && result.data.diabetes_risk !== undefined) {
        const d = result.data
        const scores = [d.diabetes_risk, d.heart_disease_risk, d.hypertension_risk]
        const avg    = Math.round(scores.reduce((a,b) => a+b, 0) / scores.length * 100)
        result.risks = {
          diabetes:     Math.round(d.diabetes_risk     * 100),
          heart:        Math.round(d.heart_disease_risk * 100),
          hypertension: Math.round(d.hypertension_risk  * 100),
          stroke:       Math.round(d.heart_disease_risk * 70),
          kidney:       Math.round(d.hypertension_risk  * 60),
        }
        result.overall       = d.overall_risk_level
        result.overallScore  = avg
        result.recommendations = d.recommendations || []
      }

      setPredictionResult(result)
      navigate('/results')

    } catch (err) {
      alert('Prediction failed: ' + (err.message || 'Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const bmiCategory = getBMICategory(form.bmi)
  const progress    = ((step + 1) / 4) * 100

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-azure-100 dark:bg-azure-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-azure-600 animate-pulse" />
          </div>
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-lg mb-2">
            AI Analysis Running
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Processing your health data through our predictive models…
          </p>
          <LoadingSpinner message="Generating risk predictions…" />
          <div className="mt-4 space-y-2 text-xs text-slate-400 text-left">
            <p>✓ Validating health metrics</p>
            <p>✓ Running disease models</p>
            <p className="animate-pulse">⟳ Computing risk scores…</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Step {step + 1} of 4 — {FIELD_GROUPS[step].title}
          </span>
          <span className="text-sm font-semibold text-azure-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-azure-500 to-azure-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {FIELD_GROUPS.map((g, i) => (
            <div key={g.id} className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step  ? 'bg-mint-500 text-white' :
                i === step? 'bg-azure-600 text-white shadow-glow-blue' :
                            'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block font-medium ${i === step ? 'text-azure-600' : 'text-slate-400'}`}>
                {g.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-6 sm:p-8 animate-fade-up">

          {/* ── Step 0: Personal ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Age <span className="text-coral-500">*</span>
                </label>
                <input type="number" name="age" value={form.age} onChange={handleChange}
                  placeholder="e.g. 35" min={1} max={120}
                  className="input-field dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100" />
                {errors.age && <p className="text-coral-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Gender <span className="text-coral-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} type="button"
                      onClick={() => { setForm(f => ({ ...f, gender: g })); setErrors(e => ({ ...e, gender: '' })) }}
                      className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                        form.gender === g
                          ? 'border-azure-600 bg-azure-600 text-white shadow-md'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-azure-300'
                      }`}>
                      {g}
                    </button>
                  ))}
                </div>
                {errors.gender && <p className="text-coral-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.gender}</p>}
              </div>
            </div>
          )}

          {/* ── Step 1: Vitals ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Height (cm) <span className="text-coral-500">*</span></label>
                  <input type="number" name="height" value={form.height} onChange={handleChange}
                    placeholder="e.g. 170" min={50} max={250}
                    className="input-field dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100" />
                  {errors.height && <p className="text-coral-500 text-xs mt-1">{errors.height}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Weight (kg) <span className="text-coral-500">*</span></label>
                  <input type="number" name="weight" value={form.weight} onChange={handleChange}
                    placeholder="e.g. 70" min={10} max={300}
                    className="input-field dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100" />
                  {errors.weight && <p className="text-coral-500 text-xs mt-1">{errors.weight}</p>}
                </div>
              </div>

              {form.bmi && (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600">
                  <div className="w-10 h-10 bg-azure-100 dark:bg-azure-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-azure-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Auto-calculated BMI</p>
                    <p className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
                      {form.bmi}
                      <span className={`text-sm ml-2 font-semibold ${bmiCategory.color}`}>{bmiCategory.label}</span>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Blood Pressure (mmHg) <span className="text-coral-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="number" name="systolic" value={form.systolic} onChange={handleChange}
                      placeholder="Systolic (e.g. 120)" min={60} max={250}
                      className="input-field dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100" />
                    {errors.systolic && <p className="text-coral-500 text-xs mt-1">{errors.systolic}</p>}
                  </div>
                  <div>
                    <input type="number" name="diastolic" value={form.diastolic} onChange={handleChange}
                      placeholder="Diastolic (e.g. 80)" min={40} max={150}
                      className="input-field dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100" />
                    {errors.diastolic && <p className="text-coral-500 text-xs mt-1">{errors.diastolic}</p>}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Normal: 120/80 mmHg</p>
              </div>
            </div>
          )}

          {/* ── Step 2: Labs ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Fasting Glucose Level (mg/dL) <span className="text-coral-500">*</span>
                </label>
                <input type="number" name="glucose" value={form.glucose} onChange={handleChange}
                  placeholder="e.g. 95" min={50} max={600}
                  className="input-field dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100" />
                {errors.glucose && <p className="text-coral-500 text-xs mt-1"><AlertCircle className="inline w-3 h-3 mr-1" />{errors.glucose}</p>}
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-mint-600">Normal: 70–99</span>
                  <span className="text-amber-500">Pre-diabetic: 100–125</span>
                  <span className="text-coral-500">Diabetic: ≥126</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Total Cholesterol (mg/dL) <span className="text-coral-500">*</span>
                </label>
                <input type="number" name="cholesterol" value={form.cholesterol} onChange={handleChange}
                  placeholder="e.g. 180" min={50} max={600}
                  className="input-field dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100" />
                {errors.cholesterol && <p className="text-coral-500 text-xs mt-1"><AlertCircle className="inline w-3 h-3 mr-1" />{errors.cholesterol}</p>}
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-mint-600">Optimal: &lt;200</span>
                  <span className="text-amber-500">Borderline: 200–239</span>
                  <span className="text-coral-500">High: ≥240</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Lifestyle ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Smoking Status <span className="text-coral-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: 'never',      label: 'Never'      },
                    { val: 'former',     label: 'Former'     },
                    { val: 'current',    label: 'Current'    },
                    { val: 'occasional', label: 'Occasional' },
                  ].map(({ val, label }) => (
                    <button key={val} type="button"
                      onClick={() => { setForm(f => ({ ...f, smoking: val })); setErrors(e => ({ ...e, smoking: '' })) }}
                      className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                        form.smoking === val
                          ? 'border-azure-600 bg-azure-600 text-white'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-azure-300'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
                {errors.smoking && <p className="text-coral-500 text-xs mt-1"><AlertCircle className="inline w-3 h-3 mr-1" />{errors.smoking}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Physical Activity Level <span className="text-coral-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { val: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise'  },
                    { val: 'light',     label: 'Light',     desc: '1–3 days/week'           },
                    { val: 'moderate',  label: 'Moderate',  desc: '3–5 days/week'           },
                    { val: 'active',    label: 'Active',    desc: '6–7 days/week'           },
                  ].map(({ val, label, desc }) => (
                    <button key={val} type="button"
                      onClick={() => { setForm(f => ({ ...f, activity: val })); setErrors(e => ({ ...e, activity: '' })) }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        form.activity === val
                          ? 'border-azure-600 bg-azure-50 dark:bg-azure-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-azure-200'
                      }`}>
                      <span className={`text-sm font-semibold ${form.activity === val ? 'text-azure-700 dark:text-azure-300' : 'text-slate-700 dark:text-slate-200'}`}>
                        {label}
                      </span>
                      <span className="text-xs text-slate-400">{desc}</span>
                    </button>
                  ))}
                </div>
                {errors.activity && <p className="text-coral-500 text-xs mt-1"><AlertCircle className="inline w-3 h-3 mr-1" />{errors.activity}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Family Medical History <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {FAMILY_HISTORY_OPTIONS.map(item => (
                    <button key={item} type="button" onClick={() => handleFamilyHistory(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                        form.familyHistory.includes(item)
                          ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20 text-coral-700 dark:text-coral-300'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-coral-200'
                      }`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={prevStep}
              className="btn-outline flex-1 sm:flex-none sm:w-32 text-sm py-3">
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-azure-600 to-azure-700 text-sm py-3.5">
              <Activity className="w-4 h-4" />
              Predict Disease Risk
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
