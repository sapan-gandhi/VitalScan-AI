import { useState, useEffect } from 'react'
import { Search, Filter, RefreshCw, TrendingUp, TrendingDown, Minus, Activity, Calendar } from 'lucide-react'
import { getPredictionHistory } from '../services/api'
import HistoryTable from '../components/HistoryTable'
import SectionHeading from '../components/SectionHeading'
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'

// Normalise backend row (snake_case, float risks) → table format (percent risks)
function normaliseRow(row) {
  // If already in mock format (risks as object with 0-100 ints), pass through
  if (row.risks && typeof row.risks.diabetes === 'number') return row

  // Backend format: diabetes_risk=0.42 etc.
  const risks = {
    diabetes:     Math.round((row.diabetes_risk     || 0) * 100),
    heart:        Math.round((row.heart_disease_risk || 0) * 100),
    hypertension: Math.round((row.hypertension_risk  || 0) * 100),
    stroke:       Math.round((row.heart_disease_risk || 0) * 70),
    kidney:       Math.round((row.hypertension_risk  || 0) * 60),
  }
  return {
    id:        row.id,
    timestamp: row.created_at || row.timestamp,
    risks,
    overall:      row.overall_risk_level || row.overall || 'Low',
    overallScore: Math.round((risks.diabetes + risks.heart + risks.hypertension) / 3),
  }
}

export default function History() {
  const [history,   setHistory]   = useState([])
  const [filtered,  setFiltered]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')
  const [filterRisk,setFilterRisk]= useState('all')

  const loadHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const res  = await getPredictionHistory()
      // Backend: { success, data: [...] }  ||  mock: [...]
      const rows = Array.isArray(res) ? res : (res.data || [])
      const norm = rows.map(normaliseRow)
      setHistory(norm)
      setFiltered(norm)
    } catch (e) {
      setError('Could not load history. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadHistory() }, [])

  useEffect(() => {
    let result = history
    if (filterRisk !== 'all')
      result = result.filter(r => r.overall?.toLowerCase() === filterRisk)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.overall?.toLowerCase().includes(q) ||
        Object.values(r.risks || {}).some(v => String(v).includes(q))
      )
    }
    setFiltered(result)
  }, [search, filterRisk, history])

  const stats = {
    total:    history.length,
    low:      history.filter(h => h.overall === 'Low').length,
    moderate: history.filter(h => h.overall === 'Moderate').length,
    high:     history.filter(h => h.overall === 'High').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <SectionHeading
            badge="Prediction History"
            title="Past Health Assessments"
            subtitle="Track how your risk profile changes with each assessment."
          />
          <div className="flex items-center gap-3">
            <button onClick={loadHistory}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:border-azure-400 transition-all">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <Link to="/predict" className="btn-primary text-sm flex items-center gap-2 py-2.5">
              <Activity className="w-4 h-4" /> New Assessment
            </Link>
          </div>
        </div>

        {/* Stats */}
        {!loading && !error && history.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label:'Total',    value:stats.total,    icon:Calendar,     bg:'bg-azure-100 dark:bg-azure-900/30', text:'text-azure-600' },
              { label:'Low Risk', value:stats.low,      icon:TrendingDown, bg:'bg-mint-100 dark:bg-mint-900/30',  text:'text-mint-600'  },
              { label:'Moderate', value:stats.moderate, icon:Minus,        bg:'bg-amber-100 dark:bg-amber-900/30',text:'text-amber-600' },
              { label:'High Risk',value:stats.high,     icon:TrendingUp,   bg:'bg-red-100 dark:bg-red-900/30',   text:'text-coral-600' },
            ].map(({ label, value, icon:Icon, bg, text }) => (
              <div key={label} className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <div>
                  <p className={`font-display font-bold text-xl ${text}`}>{value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by risk level or score…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[160px] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100">
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="glass-card dark:bg-slate-800/80 p-6 text-center text-coral-600 dark:text-coral-400 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-8">
            <LoadingSpinner message="Loading prediction history…" />
          </div>
        ) : (
          <>
            {filtered.length < history.length && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Showing <strong className="text-slate-700 dark:text-slate-200">{filtered.length}</strong> of {history.length} records
              </p>
            )}
            <HistoryTable data={filtered} />
          </>
        )}
      </div>
    </div>
  )
}
