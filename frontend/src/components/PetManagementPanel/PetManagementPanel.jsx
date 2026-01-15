import { useState, useEffect } from 'react'
import {
  Col,
  Row,
  Spinner,
  Alert,
  Form,
  Button,
  Modal,
  Container,
} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { PetFilters } from '../PetFilters/PetFilters'
import { PetCard } from '../PetCard/PetCard'
import { PetCreatePanel } from '../DashboardContentAdmin/PetCreatePanel'
import { PetEditPanel } from '../DashboardContentAdmin/PetEditPanel'
import './PetManagementPanel.css'
import { PaginationControls } from '../PaginationControls/PaginationControls'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function PetManagementPanel() {
  const [pets, setPets] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const [filters, setFilters] = useState({
    nome: '',
    especie: '',
    tamanho: '',
    personalidade: '',
    status: '',
    page: 1,
    limit: 7,
  })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState(null)

  const fetchAllPets = async () => {
    if (!token) return
    try {
      setLoading(true)
      setError(null)

      const activeFilters = {}
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          activeFilters[key] = filters[key]
        }
      })
      activeFilters.page = filters.page || 1
      activeFilters.limit = filters.limit || 8

      const params = new URLSearchParams(activeFilters)

      const response = await fetch(`${API_URL}/pets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new Error('Falha ao buscar pets.')
      }
      const data = await response.json()
      setPets(data.data || [])
      setPagination(data.pagination || null)
    } catch (err) {
      console.error(err)
      setError(err.message)
      setPets([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPets()
  }, [token, filters])

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => {
      const baseFilters = {
        limit: prevFilters.limit,
        page: 1,
      }
      return { ...baseFilters, ...newFilters }
    })
  }
  const handleClearFiltersInParent = () => {
    setFilters((prev) => ({
      nome: '',
      especie: '',
      tamanho: '',
      personalidade: '',
      status: '',
      page: 1,
      limit: prev.limit,
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters((prevFilters) => ({ ...prevFilters, page: newPage }))
  }
  const handleLimitChange = (newLimit) => {
    setFilters((prevFilters) => ({ ...prevFilters, limit: newLimit, page: 1 }))
  }

  const handleDelete = (pet) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Excluir "${capitalizeFirstLetter(pet.nome)}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, excluir!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/pets/${pet.pet_id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!response.ok) {
            const errData = await response.json()
            if (response.status === 409) {
              throw new Error(
                errData.error || 'Não pode excluir: pet tem adoção.',
              )
            }
            throw new Error(errData.error || 'Falha ao excluir pet.')
          }
          Swal.fire('Excluído!', 'O pet foi removido.', 'success')
          fetchAllPets()
        } catch (err) {
          Swal.fire('Erro!', err.message, 'error')
        }
      }
    })
  }

  const handleShowEditModal = (pet) => {
    setSelectedPet(pet)
    setShowEditModal(true)
  }
  const handleShowCreateModal = () => {
    setShowCreateModal(true)
  }
  const handleCloseModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedPet(null)
  }
  const handleSuccess = () => {
    handleCloseModals()
    fetchAllPets()
  }

  if (error) {
    return (
      <Container className="p-4">
        <Alert variant="danger">
          <strong>Erro:</strong> {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="p-4">
      <h2 className="mb-4">Gerenciar Pets</h2>

      {/* Paginação (Topo) */}
      <div className="mb-3">
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Filtros */}
      <div className="mb-0">
        <PetFilters
          onFilterChange={handleFilterChange}
          onClear={handleClearFiltersInParent}
          showStatusFilter={true}
        />
      </div>

      {/* Lista de Pets */}
      <Row xs={1} md={2} lg={4} className="g-4 mt-3 mb-4">
        {/* Card de Adicionar */}
        <Col>
          <div className="pet-card-new" onClick={handleShowCreateModal}>
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="pet-card-new-icon"
            />
            <h3 className="pet-card-new-title">Registrar Novo Pet</h3>
          </div>
        </Col>

        {/* Feedback de Carregamento */}
        {loading && (
          <Col md={12} className="text-center mt-4">
            <Spinner animation="border" />
            <p>Carregando pets...</p>
          </Col>
        )}

        {/* Lista de Pets */}
        {!loading &&
          pets.map((pet) => (
            <Col key={pet.pet_id}>
              <PetCard
                pet={pet}
                isAdminView={true}
                onEditClick={handleShowEditModal}
                onDeleteClick={handleDelete}
              />
            </Col>
          ))}

        {/* Mensagem se não houver resultados */}
        {!loading && pets.length === 0 && (
          <Col md={12}>
            <Alert variant="info" className="mt-3">
              Nenhum pet encontrado para os filtros aplicados.
            </Alert>
          </Col>
        )}
      </Row>

      {/* Paginação (Base) */}
      <div className="mt-0">
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Modal de Criação */}
      <Modal
        show={showCreateModal}
        onHide={handleCloseModals}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Novo Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PetCreatePanel
            onSuccess={handleSuccess}
            onCancel={handleCloseModals}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        show={showEditModal}
        onHide={handleCloseModals}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Editar Pet:{' '}
            {selectedPet?.nome ? capitalizeFirstLetter(selectedPet.nome) : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPet && (
            <PetEditPanel
              pet={selectedPet}
              onSuccess={handleSuccess}
              onCancel={handleCloseModals}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  )
}

function capitalizeFirstLetter(string) {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}
