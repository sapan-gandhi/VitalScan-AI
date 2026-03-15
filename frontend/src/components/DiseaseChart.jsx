import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadialBarChart, RadialBar, Legend
} from 'recharts'

const COLORS = {
  diabetes: '#0e86e8',
  heart: '#f43f5e',
  hypertension: '#f59e0b',
  stroke: '#a855f7',
  kidney: '#22c55e',
}

const LABELS = {
  diabetes: 'Diabetes',
  heart: 'Heart',
  hypertension: 'Hypertension',
  stroke: 'Stroke',
  kidney: 'Kidney',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-card px-4 py-3 text-sm">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label || payload[0]?.name}</p>
        <p className="text-azure-600 font-bold">{payload[0]?.value}% risk</p>
      </div>
    )
  }
  return null
}

export function RiskBarChart({ risks }) {
  const data = Object.entries(risks).map(([key, value]) => ({
    name: LABELS[key] || key,
    value,
    color: COLORS[key] || '#0e86e8',
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 10, fontFamily: 'DM Sans', fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14,134,232,0.05)' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RiskRadarChart({ risks }) {
  const data = Object.entries(risks).map(([key, value]) => ({
    subject: LABELS[key] || key,
    value,
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#94a3b8' }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: '#94a3b8' }}
          tickCount={4}
        />
        <Radar
          name="Risk"
          dataKey="value"
          stroke="#0e86e8"
          fill="#0e86e8"
          fillOpacity={0.18}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export function RiskRadialChart({ risks }) {
  const data = Object.entries(risks).map(([key, value]) => ({
    name: LABELS[key] || key,
    value,
    fill: COLORS[key] || '#0e86e8',
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="20%"
        outerRadius="90%"
        barSize={12}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          minAngle={5}
          background={{ fill: '#f1f5f9' }}
          clockWise
          dataKey="value"
          cornerRadius={6}
        />
        <Legend
          iconSize={8}
          iconType="circle"
          layout="horizontal"
          verticalAlign="bottom"
          wrapperStyle={{ fontSize: '11px', fontFamily: 'DM Sans', paddingTop: '8px' }}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}
