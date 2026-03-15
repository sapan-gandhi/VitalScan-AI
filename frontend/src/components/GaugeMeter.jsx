import { useEffect, useRef, useState } from 'react'

export default function GaugeMeter({ value = 0, label = 'Overall Risk', size = 200 }) {
  const [animated, setAnimated] = useState(0)
  const ref = useRef(null)

  const radius = 80
  const circumference = Math.PI * radius // half circle
  const strokeWidth = 14
  const cx = size / 2
  const cy = size * 0.58

  const clampedValue = Math.min(100, Math.max(0, value))
  const offset = circumference - (clampedValue / 100) * circumference

  const getColor = (v) => {
    if (v < 30) return '#22c55e'
    if (v < 60) return '#f59e0b'
    return '#f43f5e'
  }

  const getLabel = (v) => {
    if (v < 30) return { text: 'Low Risk', color: '#22c55e' }
    if (v < 60) return { text: 'Moderate', color: '#f59e0b' }
    return { text: 'High Risk', color: '#f43f5e' }
  }

  useEffect(() => {
    let start = null
    const duration = 1400
    const from = 0
    const to = clampedValue

    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(from + (to - from) * ease))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [clampedValue])

  const color = getColor(animated)
  const riskLabel = getLabel(animated)

  // Tick marks
  const ticks = [0, 25, 50, 75, 100]

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg
        width={size}
        height={size * 0.65}
        viewBox={`0 0 ${size} ${size * 0.65}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="dark:stroke-slate-700"
        />

        {/* Colored gradient arc */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* Value arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (animated / 100) * circumference}
          style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease' }}
        />

        {/* Tick marks */}
        {ticks.map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI
          const tickRadius = radius + strokeWidth / 2 + 6
          const x1 = cx + (radius - strokeWidth / 2) * Math.cos(angle)
          const y1 = cy - (radius - strokeWidth / 2) * Math.sin(angle)
          const x2 = cx + tickRadius * Math.cos(angle)
          const y2 = cy - tickRadius * Math.sin(angle)
          const lx = cx + (radius + strokeWidth / 2 + 18) * Math.cos(angle)
          const ly = cy - (radius + strokeWidth / 2 + 18) * Math.sin(angle)
          return (
            <g key={tick}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={1.5} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#94a3b8">
                {tick}
              </text>
            </g>
          )
        })}

        {/* Needle */}
        {(() => {
          const angle = Math.PI - (animated / 100) * Math.PI
          const needleLen = radius - 12
          const nx = cx + needleLen * Math.cos(angle)
          const ny = cy - needleLen * Math.sin(angle)
          return (
            <>
              <circle cx={cx} cy={cy} r={8} fill={color} />
              <circle cx={cx} cy={cy} r={4} fill="white" />
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                style={{ transition: 'all 0.1s linear' }}
              />
            </>
          )
        })()}

        {/* Center value */}
        <text
          x={cx}
          y={cy - 22}
          textAnchor="middle"
          fontSize="28"
          fontWeight="800"
          fill={color}
          fontFamily="Syne, sans-serif"
          style={{ transition: 'fill 0.3s ease' }}
        >
          {animated}%
        </text>

        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fontSize="11"
          fill={riskLabel.color}
          fontWeight="600"
          fontFamily="DM Sans, sans-serif"
        >
          {riskLabel.text}
        </text>

        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="10"
          fill="#94a3b8"
          fontFamily="DM Sans, sans-serif"
        >
          {label}
        </text>
      </svg>
    </div>
  )
}
