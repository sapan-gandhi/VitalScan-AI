export default function FeatureCard({ icon: Icon, title, desc, color = 'azure', delay = 0 }) {
  const colorMap = {
    azure: {
      bg: 'bg-azure-100 dark:bg-azure-900/30',
      icon: 'text-azure-600 dark:text-azure-400',
      border: 'hover:border-azure-200',
    },
    mint: {
      bg: 'bg-mint-100 dark:bg-mint-900/30',
      icon: 'text-mint-600 dark:text-mint-400',
      border: 'hover:border-mint-200',
    },
    coral: {
      bg: 'bg-coral-100 dark:bg-coral-900/30',
      icon: 'text-coral-600 dark:text-coral-400',
      border: 'hover:border-coral-200',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-200',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-200',
    },
  }

  const c = colorMap[color] || colorMap.azure

  return (
    <div
      className={`glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-6 border border-transparent ${c.border} hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-2 text-base">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
