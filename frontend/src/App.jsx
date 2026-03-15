import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import Layout from './layouts/Layout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import InputForm from './pages/InputForm'
import ResultsDashboard from './pages/ResultsDashboard'
import History from './pages/History'

export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  )
  const [predictionResult, setPredictionResult] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Main layout with Navbar + Footer ── */}
          <Route element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/predict"
              element={
                <ProtectedRoute>
                  <InputForm setPredictionResult={setPredictionResult} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <ResultsDashboard result={predictionResult} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ── Auth layout (no navbar/footer) ── */}
          <Route element={<AuthLayout />}>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
