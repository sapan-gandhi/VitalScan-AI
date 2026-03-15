import { useEffect, useState } from 'react'
import { getRiskLevel } from '../utils/helpers'

export default function RiskCard({ disease, icon: Icon, percent, delay = 0 }) {
  const [animated, setAnimated] = useState(0)
  const [visible, setVisible] = useState(false)
  const risk = getRiskLevel(percent)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
      let start = null
      const duration = 1200

      const step = (ts) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        setAnimated(Math.round(percent * ease))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)

    return () => clearTimeout(timer)
  }, [percent, delay])

  return (
    <div
      className={`glass-card p-5 border ${risk.borderColor} ${risk.bgColor} hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 ${
        visible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              percent >= 60 ? 'bg-coral-500' : percent >= 30 ? 'bg-amber-500' : 'bg-mint-500'
            } shadow-md`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">
              {disease}
            </h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${risk.textColor} ${risk.bgColor} border ${risk.borderColor}`}>
              {risk.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-display font-bold ${risk.textColor}`}>
            {animated}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${animated}%`,
            backgroundColor: risk.barColor,
            transition: `width ${1.2 + delay / 1000}s cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-400 dark:text-slate-500">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
    </div>
  )
}
