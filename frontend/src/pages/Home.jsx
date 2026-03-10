import { useState, useEffect, useRef } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import { CtaBanner } from '../components/CtaBanner/CtaBanner'
import { PetFilters } from '../components/PetFilters/PetFilters'
import { FaqSection } from '../components/FaqSection/FaqSection'
import { PetList } from '../components/PetList/PetList'
import { Footer } from '../components/Footer/Footer'
import { PaginationControls } from '../components/PaginationControls/PaginationControls'
import { PetDetailModal } from '../components/PetDetailModal/PetDetailModal'
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground'
import { AdoptionCountBanner } from '../components/AdoptionCountBanner/AdoptionCountBanner'

export function Home() {
  const [pets, setPets] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showWakeUpMessage, setShowWakeUpMessage] = useState(false)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    sexo: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState(null)
  const buscaSectionRef = useRef(null)

  useEffect(() => {
    async function fetchPets() {
      setLoading(true)
      setShowWakeUpMessage(false)
      const wakeUpTimer = setTimeout(() => {
        setShowWakeUpMessage(true)
      }, 2500)

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
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
        clearTimeout(wakeUpTimer)
        setLoading(false)
        setShowWakeUpMessage(false)
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

  const homeBackgroundImageUrl = '/patinhas.png'

  return (
    <main style={{ position: 'relative' }}>
      <CtaBanner
        imageUrl="/gato-e-cachorro.jpg"
        imageAlt="Cachorro e Gato"
        title="O seu novo melhor amigo está te esperando!"
        buttonText="Encontre seu Pet"
        buttonHref="#busca"
        onClick={(e) => {
          e.preventDefault()
          buscaSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <Container
        as="section"
        id="busca"
        className="py-5 my-4"
        ref={buscaSectionRef}
      >
        <h2 className="text-center mb-4 display-5 fw-light">
          Encontre seu novo amigo
        </h2>

        <div className="mb-3">
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>

        <PetFilters onFilterChange={handleFilterChange} className="mb-3" />

        {loading && (
          <div className="text-center mt-5 py-5">
            <Spinner
              animation="border"
              variant="primary"
              role="status"
              className="mb-3"
            >
              <span className="visually-hidden">Carregando...</span>
            </Spinner>

            {showWakeUpMessage && (
              <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
                <Alert
                  variant="warning"
                  className="d-inline-block shadow-sm border-0 bg-warning bg-opacity-10 text-dark"
                >
                  <div className="d-flex align-items-center gap-3 p-2">
                    <span style={{ fontSize: '1.5rem' }}>🐾</span>
                    <div className="text-start">
                      <strong className="d-block">
                        O servidor está acordando...
                      </strong>
                      <span className="small">
                        Estamos iniciando os serviços no Render. Isso pode levar
                        cerca de 50 segundos. <br />
                        Agradecemos a sua paciência!
                      </span>
                    </div>
                  </div>
                </Alert>
              </div>
            )}
          </div>
        )}

        {!loading && pets.length === 0 && (
          <Alert variant="info" className="mt-4">
            Nenhum pet encontrado com esses filtros.
          </Alert>
        )}

        {!loading && pets.length > 0 && (
          <div className="mt-0">
            <PetList pets={pets} onPetClick={handleShowModal} />
          </div>
        )}

        <div className="mt-4">
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </Container>

      <AdoptionCountBanner />
      <FaqSection />
      <Footer />

      {selectedPet && (
        <PetDetailModal
          show={showModal}
          onHide={handleCloseModal}
          pet={selectedPet}
          onAdocaoConcluida={handleAdocaoConcluida}
        />
      )}

      <AnimatedBackground
        imageUrl={homeBackgroundImageUrl}
        opacity={0.4}
        isLocalElement={true}
        isCornerImage={true}
        backgroundSize="200px"
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
