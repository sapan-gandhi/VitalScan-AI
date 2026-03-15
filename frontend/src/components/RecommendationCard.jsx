import { AlertCircle, CheckCircle, Info } from 'lucide-react'

const priorityConfig = {
  high: {
    badge: 'Priority',
    badgeClass: 'bg-coral-100 text-coral-700 border-coral-200',
    dot: 'bg-coral-500',
    border: 'border-l-coral-500',
    icon: AlertCircle,
    iconClass: 'text-coral-500',
  },
  medium: {
    badge: 'Suggested',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    border: 'border-l-amber-500',
    icon: Info,
    iconClass: 'text-amber-500',
  },
  low: {
    badge: 'Maintain',
    badgeClass: 'bg-mint-100 text-mint-700 border-mint-200',
    dot: 'bg-mint-500',
    border: 'border-l-mint-500',
    icon: CheckCircle,
    iconClass: 'text-mint-600',
  },
}

export default function RecommendationCard({ title, desc, priority = 'medium', icon: CustomIcon }) {
  const cfg = priorityConfig[priority] || priorityConfig.medium
  const IconComp = CustomIcon || cfg.icon

  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 border-l-4 ${cfg.border} rounded-xl p-4 hover:shadow-card transition-all duration-200 hover:-translate-y-0.5`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          <IconComp className={`w-5 h-5 ${cfg.iconClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.badgeClass}`}>
              {cfg.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  )
}
