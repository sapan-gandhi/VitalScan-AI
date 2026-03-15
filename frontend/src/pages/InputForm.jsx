import HealthInputForm from '../components/HealthInputForm'
import SectionHeading from '../components/SectionHeading'
import { Shield, Lock, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function InputForm({ setPredictionResult }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10 items-start">

          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-5">
            <SectionHeading
              badge="Health Assessment"
              title="Check Your Disease Risk"
              subtitle="Enter your health data for a personalised AI-powered risk prediction."
            />

            {/* Logged-in user card */}
            {user && (
              <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-4 flex items-center gap-3 border-l-4 border-l-azure-500">
                <div className="w-9 h-9 bg-azure-600 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {user.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.full_name}</p>
                  <p className="text-xs text-slate-400">Results will be saved to your account</p>
                </div>
              </div>
            )}

            <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-5 space-y-3">
              <h4 className="font-display font-bold text-slate-700 dark:text-slate-200 text-sm">What you'll get</h4>
              {[
                'Risk scores for 5 chronic diseases',
                'Colour-coded risk level indicators',
                'Personalised preventive recommendations',
                'Visual risk charts & gauge meter',
                'Downloadable health report',
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-mint-100 dark:bg-mint-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-mint-500 rounded-full" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item}</p>
                </div>
              ))}
            </div>

            <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-azure-100 dark:bg-azure-900/30 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-azure-600" />
                </div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Privacy & Security</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your health data is encrypted and securely stored in your account. We never share personal health information with third parties.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 px-1">
              <Shield className="w-4 h-4 text-mint-500 flex-shrink-0" />
              Not a substitute for professional medical consultation.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <HealthInputForm setPredictionResult={setPredictionResult} />
          </div>
        </div>
      </div>
    </div>
  )
}
