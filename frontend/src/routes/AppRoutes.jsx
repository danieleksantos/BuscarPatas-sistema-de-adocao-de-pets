import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home.jsx'
import { Sobre } from '../pages/Sobre.jsx'
import { Cadastro } from '../pages/Cadastro.jsx'
import { Login } from '../pages/Login/Login.jsx'
import { DashboardAdmin } from '../pages/DashboardAdmin.jsx'
import { DashboardUser } from '../pages/DashboardUser.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { AuthCallback } from '../pages/AuthCallback/AuthCallback.jsx'
import { AgradecimentoInstrutores } from '../pages/AgradecimentoInstrutores.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agradecimento" element={<AgradecimentoInstrutores />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboardAdmin"
        element={
          <ProtectedRoute adminOnly={true}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboardUser"
        element={
          <ProtectedRoute>
            <DashboardUser />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
