import { useState, useEffect, useRef } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import { PetFilters } from '../PetFilters/PetFilters'
import { PetList } from '../PetList/PetList'
import { PaginationControls } from '../PaginationControls/PaginationControls'
import { PetDetailModal } from '../PetDetailModal/PetDetailModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function BuscarPets() {
  const [pets, setPets] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState(null)
  const buscaSectionRef = useRef(null)

  useEffect(() => {
    async function fetchPets() {
      setLoading(true)
      const activeFilters = { status: 'DISPONIVEL' }
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          activeFilters[key] = filters[key]
        }
      })
      activeFilters.page = filters.page || 1
      activeFilters.limit = filters.limit || 8

      const queryParams = new URLSearchParams(activeFilters).toString()
      const url = `${API_URL}/pets?${queryParams}`

      try {
        const response = await fetch(url)
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setPets(data.data || [])
        setPagination(data.pagination || null)
      } catch (error) {
        console.error('Falha ao buscar pets:', error)
        setPets([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPets()
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => {
      const baseFilters = { limit: prevFilters.limit, page: 1 }
      return { ...baseFilters, ...newFilters }
    })
  }
  const handlePageChange = (newPage) => {
    setFilters((prevFilters) => ({ ...prevFilters, page: newPage }))
    buscaSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const handleLimitChange = (newLimit) => {
    setFilters((prevFilters) => ({ ...prevFilters, limit: newLimit, page: 1 }))
    buscaSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const handleShowModal = (pet) => {
    setSelectedPet(pet)
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPet(null)
  }
  const handleAdocaoConcluida = () => {
    handleCloseModal()
    setFilters((currentFilters) => ({ ...currentFilters }))
  }

  return (
    <>
      <Container
        as="section"
        id="busca-pets-dashboard"
        className="py-5 my-4"
        ref={buscaSectionRef}
      >
        <h2 className="text-center mb-4 display-5 fw-light">
          {' '}
          Encontre seu novo amigo{' '}
        </h2>

        {/* Paginação Topo */}
        <div className="mb-3">
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>

        {/* Filtros */}
        <PetFilters onFilterChange={handleFilterChange} className="mb-3" />

        {/* Lista de Pets */}
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}
        {!loading && pets.length === 0 && (
          <Alert variant="info">Nenhum pet encontrado com esses filtros.</Alert>
        )}
        {!loading && pets.length > 0 && (
          <PetList pets={pets} onPetClick={handleShowModal} />
        )}

        {/* Paginação Base */}
        <div className="mt-4">
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </Container>

      {/* Modal de Detalhes */}
      {selectedPet && (
        <PetDetailModal
          show={showModal}
          onHide={handleCloseModal}
          pet={selectedPet}
          onAdocaoConcluida={handleAdocaoConcluida}
        />
      )}
    </>
  )
}
