export default function SectionHeading({ badge, title, subtitle, center = false }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-azure-100 dark:bg-azure-900/40 text-azure-700 dark:text-azure-300 text-xs font-semibold mb-4 border border-azure-200 dark:border-azure-700">
          {badge}
        </span>
      )}
      <h2 className="section-heading mb-3">{title}</h2>
      {subtitle && (
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
