import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Spinner, Container, Alert } from 'react-bootstrap'

export function AuthCallback() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, user } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (token) {
      login(token)
    } else if (error) {
      console.error('Erro na autenticação Google:', error)
      navigate('/login?error=' + error)
    } else {
      navigate('/login')
    }
  }, [location, login, navigate])

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/dashboardAdmin')
      } else {
        navigate('/dashboardUser')
      }
    }
  }, [user, navigate])

  // Mostra um indicador de carregamento enquanto o processo ocorre
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh' }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Processando login...</span>
      </Spinner>
    </Container>
  )
}
