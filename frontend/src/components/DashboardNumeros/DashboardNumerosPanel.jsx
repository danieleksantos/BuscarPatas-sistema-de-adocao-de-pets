import React, { useState, useEffect } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import { NumerosCard } from '../NumerosCard/NumerosCard'
import { useAuth } from '../../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const IMAGE_ADOTANTES =
  'https://images.unsplash.com/photo-1610573501131-a9766c02001a?auto=format&fit=crop&q=80&w=870'
const IMAGE_TOTAL_PETS =
  'https://images.unsplash.com/photo-1469569946320-b4f13e4b7d5e?auto=format&fit=crop&q=80&w=870'
const IMAGE_PETS_ADOTADOS =
  'https://plus.unsplash.com/premium_photo-1731629278699-a0c9610babe2?auto=format&fit=crop&q=80&w=870'
const IMAGE_PETS_AGUARDANDO =
  'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870'

export function DashboardNumerosPanel() {
  const { token, user } = useAuth()

  const [counts, setCounts] = useState({
    totalAdotantes: '...',
    totalPets: '...',
    petsAdotados: '...',
    petsAguardando: '...',
    totalAdmins: '...',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCounts = async () => {
      if (!token) {
        setLoading(false)
        setError('Usuário não autenticado.')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/dashboard/counts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error || `Falha ao carregar. Status: ${response.status}`,
          )
        }

        const data = await response.json()

        //  Cálculo e Atualização do Estado
        const petsAguardando = (data.totalPets || 0) - (data.petsAdotados || 0)

        setCounts({
          totalAdotantes: data.totalAdotantes || 0,
          totalPets: data.totalPets || 0,
          petsAdotados: data.petsAdotados || 0,
          petsAguardando: petsAguardando,
          totalAdmins: data.totalAdmins || 0,
        })
      } catch (err) {
        console.error('Erro na busca do dashboard:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [token, user])

  if (loading) {
    return (
      <div className="container p-5 text-center">
        <h2 className="display-6 fs-2 fw-semibold">Nossos Números</h2>
        <Spinner
          animation="border"
          role="status"
          className="mt-4 text-principal"
        >
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container p-4">
        <h2 className="display-6 fs-2 fw-semibold">Nossos Números</h2>
        <Alert variant="danger" className="mt-4">
          **Erro ao carregar dados:** {error}. Certifique-se de que o backend
          está rodando e a rota está protegida corretamente.
        </Alert>
      </div>
    )
  }

  return (
    <div className="container p-4">
      <h2 className="display-6 fs-2 text-center fw-semibold mb-4">
        Nossos Números
      </h2>

      <NumerosCard
        titulo="Total de adotantes cadastrados:"
        numero={counts.totalAdotantes}
        imagem={IMAGE_ADOTANTES}
        inverter={true}
      />
      <NumerosCard
        titulo="Total de pets cadastrados:"
        numero={counts.totalPets}
        imagem={IMAGE_TOTAL_PETS}
        inverter={false}
      />
      <NumerosCard
        titulo="Total de pets adotados:"
        numero={counts.petsAdotados}
        imagem={IMAGE_PETS_ADOTADOS}
        inverter={true}
      />
      <NumerosCard
        titulo="Pets aguardando adoção:"
        numero={counts.petsAguardando}
        imagem={IMAGE_PETS_AGUARDANDO}
        inverter={false}
      />
    </div>
  )
}
