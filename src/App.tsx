import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { CharacterListPage } from './pages/CharacterListPage'
import { CharacterSheetPage } from './pages/CharacterSheetPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <div className="parchment flex min-h-screen items-center justify-center">
        <p className="text-stone-600">Carregando…</p>
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}

function Routed() {
  const { session } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <CharacterListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/ficha/:id"
        element={
          <RequireAuth>
            <CharacterSheetPage />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routed />
    </AuthProvider>
  )
}
