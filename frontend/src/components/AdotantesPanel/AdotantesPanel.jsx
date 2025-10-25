import { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../../contexts/AuthContext'
import { AdotanteCard } from '../AdotanteCard/AdotanteCard'
import { AdotanteEditModal } from '../AdotanteEditModal/AdotanteEditModal'
import './AdotantesPanel.css'

// DEFINIÇÃO DA URL DA API (Usando import.meta.env para Vite)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function AdotantesPanel() {
  const [adotantes, setAdotantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAdotante, setSelectedAdotante] = useState(null)

  // função fetchAdotantes com useCallback
  const fetchAdotantes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/adotantes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao buscar adotantes.')
      }
      const data = await response.json()
      setAdotantes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchAdotantes()
    }
  }, [token, fetchAdotantes])

  const handleEditAdotante = (adotante) => {
    setSelectedAdotante(adotante)
    setShowEditModal(true)
  }

  const handleUpdateSuccess = (updatedUser) => {
    setAdotantes((currentAdotantes) =>
      currentAdotantes.map((user) =>
        user.adotante_id === updatedUser.adotante_id ? updatedUser : user,
      ),
    )
  }

  const handleDeleteAdotante = (adotanteId, adotanteNome) => {
    Swal.fire({
      title: `Deletar ${adotanteNome}?`,
      text: 'Esta ação é irreversível.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/adotantes/${adotanteId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Falha ao deletar adotante.')
          }

          // Remove o usuário da lista localmente para atualizar a UI instantaneamente
          setAdotantes((currentAdotantes) =>
            currentAdotantes.filter((user) => user.adotante_id !== adotanteId),
          )
          Swal.fire('Deletado!', `${adotanteNome} foi removido.`, 'success')
        } catch (err) {
          Swal.fire('Erro!', err.message, 'error')
        }
      }
    })
  }

  const handleRoleChange = async (adotanteId, newRole) => {
    try {
      const response = await fetch(`${API_URL}/adotantes/${adotanteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Falha ao mudar a permissão.`)
      }

      const updatedUser = await response.json()

      // Atualiza o usuário específico na lista localmente
      setAdotantes((currentAdotantes) =>
        currentAdotantes.map((user) =>
          user.adotante_id === adotanteId ? updatedUser : user,
        ),
      )
    } catch (err) {
      Swal.fire('Erro!', err.message, 'error')
    }
  }

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    )
  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )

  return (
    <Container className="adotantes-panel p-4">
      <h2 className="mb-4">Gerenciar Adotantes</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {adotantes.map((adotante) => (
            <Col
              key={adotante.adotante_id}
              xs={12}
              sm={6}
              lg={4}
              xl={3}
              className="mb-4"
            >
              <AdotanteCard
                user={adotante}
                onEdit={handleEditAdotante}
                onDelete={handleDeleteAdotante}
                onRoleChange={handleRoleChange}
              />
            </Col>
          ))}
        </Row>
      )}

      {selectedAdotante && (
        <AdotanteEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          adotante={selectedAdotante}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </Container>
  )
}
