import { formatDate, formatTime, getOverallColor } from '../utils/helpers'
import { TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react'

function RiskBadge({ value }) {
  const color = value < 30 ? 'bg-mint-100 text-mint-700' : value < 60 ? 'bg-amber-100 text-amber-700' : 'bg-coral-100 text-coral-600'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${color}`}>
      {value}%
    </span>
  )
}

function OverallBadge({ category }) {
  const color =
    category === 'Low' ? 'bg-mint-100 text-mint-700 border-mint-200' :
    category === 'Moderate' ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-coral-100 text-coral-600 border-coral-200'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
      {category === 'Low' && <TrendingDown className="w-3 h-3" />}
      {category === 'Moderate' && <Minus className="w-3 h-3" />}
      {category === 'High' && <TrendingUp className="w-3 h-3" />}
      {category}
    </span>
  )
}

export default function HistoryTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="font-display font-bold text-slate-700 dark:text-slate-300 mb-2">No predictions yet</h3>
        <p className="text-slate-400 text-sm">Complete your first health assessment to see results here.</p>
      </div>
    )
  }

  return (
    <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Diabetes</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Heart</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hypertension</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stroke</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kidney</th>
              <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-azure-50/40 dark:hover:bg-azure-900/10 transition-colors duration-150"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{formatDate(row.timestamp || row.date)}</p>
                    <p className="text-xs text-slate-400">{formatTime(row.timestamp || row.date)}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-center"><RiskBadge value={row.risks?.diabetes ?? '—'} /></td>
                <td className="px-4 py-4 text-center"><RiskBadge value={row.risks?.heart ?? '—'} /></td>
                <td className="px-4 py-4 text-center"><RiskBadge value={row.risks?.hypertension ?? '—'} /></td>
                <td className="px-4 py-4 text-center"><RiskBadge value={row.risks?.stroke ?? '—'} /></td>
                <td className="px-4 py-4 text-center"><RiskBadge value={row.risks?.kidney ?? '—'} /></td>
                <td className="px-5 py-4 text-center">
                  <OverallBadge category={row.overall} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
        {data.map((row, i) => (
          <div key={row.id || i} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{formatDate(row.timestamp || row.date)}</p>
                <p className="text-xs text-slate-400">{formatTime(row.timestamp || row.date)}</p>
              </div>
              <OverallBadge category={row.overall} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Diabetes', val: row.risks?.diabetes },
                { label: 'Heart', val: row.risks?.heart },
                { label: 'Hypertension', val: row.risks?.hypertension },
                { label: 'Stroke', val: row.risks?.stroke },
                { label: 'Kidney', val: row.risks?.kidney },
              ].map(({ label, val }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <RiskBadge value={val ?? '—'} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
