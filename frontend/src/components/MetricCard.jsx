export default function MetricCard({ icon: Icon, label, value, unit, sub, color = 'azure' }) {
  const colorMap = {
    azure: 'bg-azure-100 dark:bg-azure-900/30 text-azure-600 dark:text-azure-400',
    mint: 'bg-mint-100 dark:bg-mint-900/30 text-mint-600 dark:text-mint-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    coral: 'bg-coral-100 dark:bg-coral-900/30 text-coral-600 dark:text-coral-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  }

  return (
    <div className="metric-card dark:bg-slate-800/80 dark:border-slate-700/60">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]} mb-2`}>
        <Icon className="w-4.5 h-4.5 w-5 h-5" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">{value}</span>
        {unit && <span className="text-xs text-slate-400 dark:text-slate-500">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}
