import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoadingSpinner message="Loading…" size="lg" />
      </div>
    )
  }

  // Already logged in — redirect to app
  if (isAuthenticated) {
    return <Navigate to="/predict" replace />
  }

  return <Outlet />
}
