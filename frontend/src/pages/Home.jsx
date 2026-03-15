import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Activity, Brain, Shield, TrendingUp, Heart, Zap,
  ArrowRight, CheckCircle, Users, Clock, Award, ChevronRight,
  Microscope, Stethoscope, ClipboardList, BarChart2
} from 'lucide-react'
import FeatureCard from '../components/FeatureCard'
import SectionHeading from '../components/SectionHeading'

function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = null
          const duration = 1800
          const step = (ts) => {
            if (!start) start = ts
            const progress = Math.min((ts - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(target * ease))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

const HOW_IT_WORKS = [
  { step: '01', icon: ClipboardList, title: 'Enter Health Data', desc: 'Input your vitals, lab results, and lifestyle information into our secure form.', color: 'azure' },
  { step: '02', icon: Brain, title: 'AI Processes Inputs', desc: 'Our machine learning model analyzes your data against population health datasets.', color: 'purple' },
  { step: '03', icon: BarChart2, title: 'Risk Score Generated', desc: 'Receive a detailed, disease-specific risk assessment with probability scores.', color: 'mint' },
  { step: '04', icon: Stethoscope, title: 'Get Recommendations', desc: 'Personalized, actionable health advice based on your unique risk profile.', color: 'coral' },
]

const STATS = [
  { value: 95, suffix: '%', label: 'Prediction Accuracy', icon: Award },
  { value: 5, suffix: '+', label: 'Diseases Screened', icon: Microscope },
  { value: 30, suffix: 's', label: 'Time to Results', icon: Clock },
  { value: 12, suffix: 'K+', label: 'Users Assessed', icon: Users },
]

const DISEASES = [
  { name: 'Type 2 Diabetes', icon: Droplets, color: 'text-azure-600', bg: 'bg-azure-50 dark:bg-azure-900/20' },
  { name: 'Heart Disease', icon: Heart, color: 'text-coral-600', bg: 'bg-coral-50 dark:bg-coral-900/20' },
  { name: 'Hypertension', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { name: 'Stroke Risk', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Kidney Disease', icon: Shield, color: 'text-mint-600', bg: 'bg-mint-50 dark:bg-mint-900/20' },
]

import { Droplets, Brain as BrainIcon } from 'lucide-react'

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 bg-gradient-to-br from-slate-50 via-azure-50 to-mint-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 bg-grid-pattern">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-[-10%] w-96 h-96 bg-azure-300/20 dark:bg-azure-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-[-5%] w-80 h-80 bg-mint-300/20 dark:bg-mint-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-azure-100 dark:bg-azure-900/40 border border-azure-200 dark:border-azure-700 rounded-full text-azure-700 dark:text-azure-300 text-xs font-semibold mb-6">
                <div className="w-2 h-2 bg-azure-500 rounded-full animate-pulse" />
                AI-Powered Health Intelligence
              </div>

              <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-slate-900 dark:text-white leading-tight mb-6">
                Predict Disease Risk{' '}
                <span className="text-azure-600 relative">
                  Before
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0,6 Q50,0 100,6 Q150,12 200,6" stroke="#0e86e8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </span>{' '}
                It Happens
              </h1>

              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                VitalScan AI uses advanced machine learning to analyze your health data and predict your risk for chronic diseases — empowering you to take preventive action today.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/predict" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                  <Activity className="w-5 h-5" />
                  Check Your Health Risk
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/history" className="btn-outline flex items-center gap-2 text-base px-8 py-4">
                  View History
                </Link>
              </div>

              <div className="flex flex-wrap gap-5 text-sm text-slate-500 dark:text-slate-400">
                {['No medical background required', 'Results in under 30 seconds', 'Completely free to use'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-mint-500 flex-shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Dashboard preview card */}
            <div className="relative animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700/60 p-6 shadow-2xl">
                {/* Mock dashboard header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <h3 className="font-display font-bold text-slate-800 dark:text-slate-100">Risk Analysis</h3>
                    <p className="text-xs text-slate-400">Sample prediction result</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    Moderate Risk
                  </span>
                </div>

                {/* Mini risk bars */}
                <div className="space-y-3 mb-5">
                  {[
                    { label: 'Diabetes Risk', value: 32, color: 'bg-azure-500' },
                    { label: 'Heart Disease', value: 45, color: 'bg-coral-500' },
                    { label: 'Hypertension', value: 28, color: 'bg-amber-500' },
                    { label: 'Stroke Risk', value: 20, color: 'bg-purple-500' },
                    { label: 'Kidney Disease', value: 15, color: 'bg-mint-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-28 flex-shrink-0">{item.label}</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-8 text-right">{item.value}%</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: '24.2', unit: 'BMI', color: 'text-mint-600' },
                    { val: '120/80', unit: 'BP', color: 'text-azure-600' },
                    { val: '95', unit: 'Glucose', color: 'text-amber-600' },
                  ].map((m) => (
                    <div key={m.unit} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                      <p className={`font-display font-bold ${m.color} text-base`}>{m.val}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{m.unit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-mint-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float">
                ✓ AI Analyzed
              </div>
              <div className="absolute -bottom-4 -left-4 bg-azure-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                5 Diseases Screened
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-azure-600 dark:bg-azure-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, suffix, label, icon: Icon }) => (
              <div key={label} className="text-center text-white">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-display font-extrabold text-3xl mb-1">
                  <AnimatedCounter target={value} suffix={suffix} />
                </p>
                <p className="text-azure-200 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISEASES COVERED */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Disease Coverage"
            title="Conditions We Screen For"
            subtitle="Our AI model evaluates your risk across five major chronic diseases that benefit most from early intervention."
            center
          />
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Type 2 Diabetes', color: 'text-azure-600', bg: 'bg-azure-50 dark:bg-azure-900/20', Icon: Droplets },
              { name: 'Heart Disease', color: 'text-coral-600', bg: 'bg-coral-50 dark:bg-coral-900/20', Icon: Heart },
              { name: 'Hypertension', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', Icon: Activity },
              { name: 'Stroke Risk', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', Icon: BrainIcon },
              { name: 'Kidney Disease', color: 'text-mint-600', bg: 'bg-mint-50 dark:bg-mint-900/20', Icon: Shield },
            ].map(({ name, color, bg, Icon }) => (
              <div key={name} className={`flex items-center gap-2.5 px-5 py-3 ${bg} rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-card transition-all duration-200 hover:-translate-y-0.5`}>
                <Icon className={`w-5 h-5 ${color}`} />
                <span className={`font-semibold text-sm ${color}`}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="How It Works"
            title="From Data to Insight in 4 Steps"
            subtitle="Our streamlined process turns your health information into actionable risk insights within seconds."
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-azure-200 via-mint-200 to-coral-200 dark:from-azure-800 dark:via-mint-800 dark:to-coral-800" />

            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-card border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-5 relative z-10">
                  <item.icon className={`w-8 h-8 ${
                    item.color === 'azure' ? 'text-azure-600' :
                    item.color === 'purple' ? 'text-purple-600' :
                    item.color === 'mint' ? 'text-mint-600' : 'text-coral-600'
                  }`} />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-600 mb-2">{item.step}</span>
                <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why VitalScan AI"
            title="Built for Preventive Healthcare"
            subtitle="Designed with medical professionals in mind, VitalScan AI delivers clinically-informed risk predictions with actionable guidance."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Brain} color="azure" delay={0} title="Machine Learning Powered" desc="Trained on validated clinical datasets to provide reliable risk estimates based on established health indicators." />
            <FeatureCard icon={Zap} color="mint" delay={100} title="Instant Results" desc="Get your complete risk analysis in under 30 seconds — no waiting, no appointments, no paperwork." />
            <FeatureCard icon={Shield} color="coral" delay={200} title="Privacy First" desc="Your health data never leaves your device. All processing is done locally with no data stored on external servers." />
            <FeatureCard icon={TrendingUp} color="amber" delay={300} title="Track Over Time" desc="Monitor how your health risk changes with each assessment and see the impact of your lifestyle improvements." />
            <FeatureCard icon={CheckCircle} color="purple" delay={400} title="Actionable Advice" desc="Each prediction comes with personalized, evidence-based recommendations tailored to your specific risk factors." />
            <FeatureCard icon={Activity} color="azure" delay={500} title="5 Disease Screening" desc="Comprehensive coverage of the five most preventable chronic diseases affecting global health outcomes." />
          </div>
        </div>
      </section>

      {/* SDG SECTION */}
      <section className="py-16 bg-gradient-to-br from-mint-50 to-azure-50 dark:from-slate-900 dark:to-slate-900 border-y border-mint-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-mint-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-green">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-semibold text-mint-700 dark:text-mint-400 uppercase tracking-wider">UN Sustainable Development Goal</span>
              <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100 mt-1 mb-2">SDG Goal 3 — Good Health & Well-Being</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
                VitalScan AI directly advances SDG 3 by making early disease detection accessible to everyone, reducing preventable deaths through data-driven health awareness and empowering individuals to act before chronic conditions develop.
              </p>
            </div>
            <Link to="/predict" className="btn-primary flex items-center gap-2 whitespace-nowrap">
              Get Started Free
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-azure-700 to-azure-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-azure-500/20 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-display font-extrabold text-4xl text-white mb-4">
            Take Control of Your Health Today
          </h2>
          <p className="text-azure-200 text-lg mb-8 leading-relaxed">
            Early detection is the most powerful tool in preventive medicine. Your risk assessment takes less than 2 minutes.
          </p>
          <Link to="/predict" className="inline-flex items-center gap-3 bg-white text-azure-700 font-bold py-4 px-10 rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-base">
            <Activity className="w-5 h-5" />
            Start Free Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
