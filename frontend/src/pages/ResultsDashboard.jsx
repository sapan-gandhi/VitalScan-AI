import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Activity, Heart, Droplets, Brain, Shield, Thermometer,
  Download, RefreshCw, User, Gauge, Utensils, Dumbbell,
  Stethoscope, CheckCircle, ArrowLeft
} from 'lucide-react'
import GaugeMeter from '../components/GaugeMeter'
import RiskCard from '../components/RiskCard'
import MetricCard from '../components/MetricCard'
import RecommendationCard from '../components/RecommendationCard'
import { RiskBarChart, RiskRadarChart } from '../components/DiseaseChart'
import SectionHeading from '../components/SectionHeading'
import { getBMICategory } from '../utils/helpers'

// ── Normalise backend OR mock response into one consistent shape ───────────────
function normalise(result) {
  if (!result) return null

  // Backend format: { success, data: { diabetes_risk, heart_disease_risk, ... } }
  if (result.data && result.data.diabetes_risk !== undefined) {
    const d = result.data
    const scores = [d.diabetes_risk, d.heart_disease_risk, d.hypertension_risk]
    const avg    = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 100)
    return {
      risks: {
        diabetes:     Math.round(d.diabetes_risk     * 100),
        heart:        Math.round(d.heart_disease_risk * 100),
        hypertension: Math.round(d.hypertension_risk  * 100),
        stroke:       Math.round(d.heart_disease_risk * 70),
        kidney:       Math.round(d.hypertension_risk  * 60),
      },
      overall:      d.overall_risk_level,
      overallScore: avg,
      recommendations: d.recommendations || [],
      timestamp:    result.timestamp || new Date().toISOString(),
      inputSummary: result.inputSummary || {},
    }
  }

  // Mock format (already has risks as percentages 0-100)
  if (result.risks) return result

  return null
}

const DISEASE_CONFIG = {
  diabetes:     { label: 'Diabetes',       icon: Droplets  },
  heart:        { label: 'Heart Disease',  icon: Heart     },
  hypertension: { label: 'Hypertension',   icon: Activity  },
  stroke:       { label: 'Stroke Risk',    icon: Brain     },
  kidney:       { label: 'Kidney Disease', icon: Shield    },
}

const REC_SECTIONS = {
  lifestyle: { label: 'Lifestyle',  icon: Dumbbell,    color: 'bg-azure-100 dark:bg-azure-900/30 text-azure-600' },
  diet:      { label: 'Diet',       icon: Utensils,    color: 'bg-mint-100 dark:bg-mint-900/30 text-mint-600'   },
  medical:   { label: 'Medical',    icon: Stethoscope, color: 'bg-coral-100 dark:bg-coral-900/30 text-coral-600'},
}

// Split flat recommendations array into 3 buckets for display
function splitRecs(recs) {
  if (!Array.isArray(recs)) return { lifestyle: [], diet: [], medical: [] }
  const lifestyle = recs.filter((_, i) => i % 3 === 0).map(r => ({ title: r, desc: '', priority: 'medium' }))
  const diet      = recs.filter((_, i) => i % 3 === 1).map(r => ({ title: r, desc: '', priority: 'medium' }))
  const medical   = recs.filter((_, i) => i % 3 === 2).map(r => ({ title: r, desc: '', priority: 'medium' }))
  return { lifestyle, diet, medical }
}

function downloadReport(n) {
  const lines = [
    'VitalScan AI — Health Risk Report',
    '===================================',
    `Date: ${new Date(n.timestamp).toLocaleString()}`,
    '',
    'RISK SCORES',
    '-----------',
    ...Object.entries(n.risks).map(([k, v]) => `${DISEASE_CONFIG[k]?.label || k}: ${v}%`),
    '',
    `Overall Risk: ${n.overall}  (Score: ${n.overallScore}%)`,
    '',
    'RECOMMENDATIONS',
    '---------------',
    ...n.recommendations.map((r, i) => `${i + 1}. ${r}`),
    '',
    'Disclaimer: For informational purposes only. Not a substitute for medical advice.',
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `vitalscan-report-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ResultsDashboard({ result }) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const normalised = normalise(result)

  useEffect(() => {
    if (!normalised) { navigate('/predict'); return }
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [normalised, navigate])

  if (!normalised) return null

  const n = normalised
  const bmiCat  = getBMICategory(n.inputSummary?.bmi || 0)
  const overallBg = n.overall === 'Low' ? 'from-mint-600 to-mint-700'
                  : n.overall === 'Moderate' ? 'from-amber-500 to-amber-600'
                  : 'from-coral-500 to-coral-600'
  const recBuckets = splitRecs(n.recommendations)

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-16 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-4">
          <div>
            <Link to="/predict" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-azure-600 transition-colors mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessment
            </Link>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-800 dark:text-white">
              Your Health Risk Report
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {new Date(n.timestamp).toLocaleString()} · AI-powered analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => downloadReport(n)}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-azure-400 rounded-xl text-sm font-semibold transition-all">
              <Download className="w-4 h-4" />
              Download
            </button>
            <Link to="/predict" className="btn-primary text-sm flex items-center gap-2 py-2.5">
              <RefreshCw className="w-4 h-4" /> New Assessment
            </Link>
          </div>
        </div>

        {/* ── Overall banner ── */}
        <div className={`rounded-2xl p-6 mb-8 text-white bg-gradient-to-r ${overallBg} relative overflow-hidden shadow-lg`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Gauge className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white/80 text-sm font-medium mb-1">Overall Health Risk Assessment</p>
              <h2 className="font-display font-extrabold text-3xl text-white mb-1">{n.overall} Risk</h2>
              <p className="text-white/80 text-sm">Average risk score: {n.overallScore}% across all screened conditions</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-xs mb-1">Risk Score</p>
              <p className="font-display font-extrabold text-5xl text-white">{n.overallScore}<span className="text-2xl">%</span></p>
            </div>
          </div>
        </div>

        {/* ── Main grid: gauge + radar | risk cards ── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Left col */}
          <div className="lg:col-span-1 space-y-5">
            <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-6">
              <h3 className="font-display font-bold text-slate-700 dark:text-slate-200 text-sm mb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-azure-600" /> Risk Gauge
              </h3>
              <GaugeMeter value={n.overallScore} label="Overall Health Risk" size={220} />
            </div>
            <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-6">
              <h3 className="font-display font-bold text-slate-700 dark:text-slate-200 text-sm mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-azure-600" /> Risk Radar
              </h3>
              <RiskRadarChart risks={n.risks} />
            </div>
          </div>

          {/* Right col — disease cards */}
          <div className="lg:col-span-2">
            <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-5">
              <h3 className="font-display font-bold text-slate-700 dark:text-slate-200 text-sm mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-coral-500" /> Disease Risk Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(n.risks).map(([key, value], i) => {
                  const cfg = DISEASE_CONFIG[key]
                  if (!cfg) return null
                  return (
                    <RiskCard
                      key={key}
                      disease={cfg.label}
                      icon={cfg.icon}
                      percent={value}
                      delay={i * 100}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bar chart ── */}
        <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-6 mb-8">
          <h3 className="font-display font-bold text-slate-700 dark:text-slate-200 text-sm mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-azure-600" /> Comparative Risk Analysis
          </h3>
          <RiskBarChart risks={n.risks} />
        </div>

        {/* ── Health metrics ── */}
        {n.inputSummary && Object.keys(n.inputSummary).length > 0 && (
          <div className="mb-8">
            <h3 className="font-display font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-azure-600" /> Your Health Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {n.inputSummary.age         && <MetricCard icon={User}        label="Age"            value={n.inputSummary.age}           unit="yrs"   color="azure" />}
              {n.inputSummary.bmi         && <MetricCard icon={Activity}    label="BMI"            value={n.inputSummary.bmi}           sub={bmiCat.label} color={Number(n.inputSummary.bmi) > 25 ? 'amber' : 'mint'} />}
              {n.inputSummary.bloodPressure && <MetricCard icon={Heart}      label="Blood Pressure" value={n.inputSummary.bloodPressure} unit="mmHg"  color="coral" />}
              {n.inputSummary.glucose     && <MetricCard icon={Droplets}    label="Glucose"        value={n.inputSummary.glucose}       unit="mg/dL" color={Number(n.inputSummary.glucose) > 100 ? 'amber' : 'mint'} />}
              {n.inputSummary.cholesterol && <MetricCard icon={Thermometer} label="Cholesterol"    value={n.inputSummary.cholesterol}   unit="mg/dL" color={Number(n.inputSummary.cholesterol) > 200 ? 'coral' : 'azure'} />}
            </div>
          </div>
        )}

        {/* ── Recommendations ── */}
        <div className="mb-8">
          <SectionHeading
            badge="AI Recommendations"
            title="Your Personalised Action Plan"
            subtitle="Evidence-based steps to reduce your risk scores over time."
          />

          {/* Flat list layout — works for both backend and mock */}
          {n.recommendations.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(recBuckets).map(([cat, items]) => {
                if (!items.length) return null
                const sec = REC_SECTIONS[cat]
                return (
                  <div key={cat} className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-5">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sec.color}`}>
                        <sec.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-bold text-slate-700 dark:text-slate-200 text-sm">{sec.label}</h4>
                    </div>
                    <div className="space-y-3">
                      {items.map((rec, i) => (
                        <RecommendationCard
                          key={i}
                          title={rec.title}
                          desc={rec.desc}
                          priority={rec.priority}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Disclaimer ── */}
        <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-5 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-azure-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            <strong className="text-slate-600 dark:text-slate-300">Disclaimer:</strong> This assessment is AI-generated for informational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
          </p>
        </div>

      </div>
    </div>
  )
}
