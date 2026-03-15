// utils/helpers.js

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return ''
  const heightM = heightCm / 100
  return (weightKg / (heightM * heightM)).toFixed(1)
}

export function getBMICategory(bmi) {
  const b = Number(bmi)
  if (b < 18.5) return { label: 'Underweight', color: 'text-azure-500' }
  if (b < 25) return { label: 'Normal', color: 'text-mint-600' }
  if (b < 30) return { label: 'Overweight', color: 'text-amber-500' }
  return { label: 'Obese', color: 'text-coral-500' }
}

export function getRiskLevel(percent) {
  if (percent < 30) return { label: 'Low Risk', color: 'mint', textColor: 'text-mint-700', bgColor: 'bg-mint-50', borderColor: 'border-mint-200', barColor: '#22c55e' }
  if (percent < 60) return { label: 'Moderate Risk', color: 'amber', textColor: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', barColor: '#f59e0b' }
  return { label: 'High Risk', color: 'coral', textColor: 'text-coral-600', bgColor: 'bg-coral-50', borderColor: 'border-coral-200', barColor: '#f43f5e' }
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })
}

export function getOverallColor(category) {
  if (category === 'Low') return 'text-mint-600'
  if (category === 'Moderate') return 'text-amber-600'
  return 'text-coral-600'
}

export function getOverallBg(category) {
  if (category === 'Low') return 'bg-mint-500'
  if (category === 'Moderate') return 'bg-amber-500'
  return 'bg-coral-500'
}
