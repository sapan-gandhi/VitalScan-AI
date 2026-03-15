import { Link } from 'react-router-dom'
import { Activity, Heart, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-azure-500 to-azure-700 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                VitalScan <span className="text-azure-400">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered early disease risk prediction to help you take control of your health before symptoms appear.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-azure-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-azure-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-azure-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/predict" className="hover:text-white transition-colors">Risk Assessment</Link></li>
              <li><Link to="/history" className="hover:text-white transition-colors">History</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">SDG Alignment</h4>
            <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-3">
              <div className="w-10 h-10 bg-mint-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">SDG Goal 3</p>
                <p className="text-xs">Good Health & Well-Being</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2025 VitalScan AI. For informational purposes only — not a substitute for medical advice.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-coral-500 fill-coral-500" /> for better health outcomes
          </p>
        </div>
      </div>
    </footer>
  )
}
