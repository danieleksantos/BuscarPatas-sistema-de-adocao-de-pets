import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { PetFilters } from '../PetFilters/PetFilters'
import { PetList } from '../PetList/PetList'
import { PaginationControls } from '../PaginationControls/PaginationControls'
import { PetDetailModal } from '../PetDetailModal/PetDetailModal'
import 'bootstrap/dist/css/bootstrap.min.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function DashboardMinhasAdocoes() {
  return (
    <div className="p-4">
      <h1 className="text-dark">Minhas Adoções</h1>
    </div>
  )
}

export function DashboardBuscarPets() {
  const [pets, setPets] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState(null)

  useEffect(() => {
    async function fetchPets() {
      setLoading(true)

      // String de query com os filtros ativos
      const queryParams = new URLSearchParams(filters).toString()
      const url = `${API_URL}/pets?${queryParams}`

      try {
        const response = await fetch(url)
        const data = await response.json()
        setPets(data.data)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Falha ao buscar pets:', error)
        // Em caso de erro, define a lista de pets como vazia
        setPets([])
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [filters])

  // Função que será chamada pelo componente PetFilters quando o usuário aplicar um filtro
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setFilters((prevFilters) => ({ ...prevFilters, page: newPage }))
  }

  const handleLimitChange = (newLimit) => {
    setFilters((prevFilters) => ({ ...prevFilters, limit: newLimit, page: 1 }))
  }

  const handleShowModal = (pet) => {
    setSelectedPet(pet)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPet(null)
  }

  return (
    <div className="p-4">
      <Container fluid>
        <h1 className="text-dark mb-4">Buscar Pets</h1>
        <p className="text-muted mb-4">
          Encontre seu novo melhor amigo! Use os filtros abaixo para encontrar
          pets que combinem com seu estilo de vida.
        </p>

        <PetFilters onFilterChange={handleFilterChange} />

        <PetList pets={pets} loading={loading} onPetClick={handleShowModal} />

        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />

        <PetDetailModal
          show={showModal}
          onHide={handleCloseModal}
          pet={selectedPet}
        />
      </Container>
    </div>
  )
}
