import { useState, useEffect } from 'react'
import {
  Card,
  Col,
  Row,
  Spinner,
  Alert,
  ListGroup,
  Form,
  Button,
} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import './AdocoesPanel.css'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faTrash,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { AdocaoEditModal } from './AdocaoEditModal'
import { AdocaoCreateModal } from './AdocaoCreateModal'
import logoBuscarPatas from '../../assets/logo.png'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const formatarData = (dataISO) => {
  if (!dataISO || typeof dataISO !== 'string') return 'Data inválida'
  try {
    const dataObj = new Date(dataISO)
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } catch (error) {
    console.error('Erro ao formatar data:', dataISO, error)
    return 'Erro na data'
  }
}

const formatarTelefone = (value) => {
  if (!value) return 'Não informado'
  const digitos = value.replace(/\D/g, '')
  if (digitos.length === 11)
    return digitos.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  if (digitos.length === 10)
    return digitos.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  return value
}

export function AdocoesPanel() {
  const [adocoes, setAdocoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()
  const [filters, setFilters] = useState({ search: '', sort: 'desc' })

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAdocao, setSelectedAdocao] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchTodasAdocoes = async () => {
    if (!token) return
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams(filters)
      const response = await fetch(`${API_URL}/adocoes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new Error('Falha ao buscar adoções. Você tem permissão de admin?')
      }
      const data = await response.json()
      setAdocoes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError(err.message)
      setAdocoes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodasAdocoes()
  }, [token, filters])

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    setFilters({
      search: formData.get('search') || '',
      sort: formData.get('sort') || 'desc',
    })
  }
  const handleClearFilters = (e) => {
    e.target.closest('form')?.reset()
    setFilters({ search: '', sort: 'desc' })
  }

  const handleDelete = (adocao) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Cancelar adoção de "${adocao.pet.nome}" por "${adocao.adotante.nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Manter',
      confirmButtonText: 'Sim, cancelar!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${API_URL}/adocoes/${adocao.adocao_id}`,
            {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          if (!response.ok) {
            const errData = await response.json()
            throw new Error(errData.error || 'Falha ao cancelar.')
          }
          Swal.fire('Cancelada!', 'Adoção desfeita.', 'success')
          setAdocoes(adocoes.filter((a) => a.adocao_id !== adocao.adocao_id))
        } catch (err) {
          Swal.fire('Erro!', err.message, 'error')
        }
      }
    })
  }

  const handleShowEditModal = (adocao) => {
    setSelectedAdocao(adocao)
    setShowEditModal(true)
  }
  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedAdocao(null)
  }
  const handleUpdateSuccess = () => {
    handleCloseEditModal()
    fetchTodasAdocoes()
  }

  const handleShowCreateModal = () => setShowCreateModal(true)
  const handleCloseCreateModal = () => setShowCreateModal(false)
  const handleCreateSuccess = () => {
    handleCloseCreateModal()
    fetchTodasAdocoes()
  }

  // --- RENDERIZAÇÃO ---
  if (loading && adocoes.length === 0) {
    return (
      <div className="p-4 text-center">
        <Spinner animation="border" />
        <p>Carregando todas as adoções...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">
          <strong>Erro:</strong> {error}
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 adocoes-panel">
      <h2 className="mb-4">Gerenciar Adoções</h2>

      {/* Formulário de Filtro */}
      <Form
        onSubmit={handleFilterSubmit}
        className="mb-4 p-3 bg-light rounded shadow-sm"
      >
        <Row className="align-items-end g-3">
          <Col md={6}>
            <Form.Group controlId="searchFiltro">
              <Form.Label className="fw-bold">
                Buscar por Pet ou Adotante
              </Form.Label>
              <Form.Control
                type="text"
                name="search"
                placeholder="Digite o nome..."
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="sortFiltro">
              <Form.Label className="fw-bold">Ordenar por Data</Form.Label>
              <Form.Select name="sort" defaultValue="desc">
                <option value="desc">Mais Recentes</option>
                <option value="asc">Mais Antigas</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex">
            <Button type="submit" className="btn-principal w-100 me-2">
              Filtrar
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              className="w-100"
              onClick={handleClearFilters}
            >
              Limpar
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Lista de Adoções */}
      <Row xs={1} md={2} lg={4} className="g-4">
        <Col>
          <div className="adocao-card-new" onClick={handleShowCreateModal}>
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="adocao-card-new-icon"
            />
            <h3 className="adocao-card-new-title">Registrar Nova Adoção</h3>
          </div>
        </Col>

        {adocoes.length === 0 && !loading && (
          <Col md={12}>
            <Alert variant="info" className="mt-3">
              Nenhum resultado encontrado.
            </Alert>
          </Col>
        )}

        {/* Lista de adoções existentes */}
        {adocoes.map(
          (adocao) =>
            adocao.pet &&
            adocao.adotante && (
              <Col key={adocao.adocao_id}>
                <Card className="h-100 shadow-sm adocao-card">
                  <Card.Img
                    variant="top"
                    src={adocao.pet.imagem_url1 || logoBuscarPatas}
                    alt={
                      adocao.pet.imagem_url1
                        ? `Foto de ${adocao.pet.nome}`
                        : 'Logo Buscar Patas'
                    }
                    style={{
                      objectFit: adocao.pet.imagem_url1 ? 'cover' : 'contain',
                      padding: adocao.pet.imagem_url1 ? '0' : '0.5rem',
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      {adocao.pet.nome}
                    </Card.Title>
                  </Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Adotante:</strong> {adocao.adotante.nome}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Telefone:</strong>{' '}
                      {formatarTelefone(adocao.adotante.telefone)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Data:</strong> {formatarData(adocao.data_adocao)}
                    </ListGroup.Item>
                  </ListGroup>
                  <Card.Footer>
                    <div className="action-buttons-group">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="action-btn-card edit"
                        title="Alterar pet desta adoção"
                        onClick={() => handleShowEditModal(adocao)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="action-btn-card delete"
                        title="Cancelar esta adoção"
                        onClick={() => handleDelete(adocao)}
                      />
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ),
        )}
      </Row>

      {/* Modal de Edição */}
      {selectedAdocao && (
        <AdocaoEditModal
          show={showEditModal}
          onHide={handleCloseEditModal}
          adocao={selectedAdocao}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Modal de Criação */}
      <AdocaoCreateModal
        show={showCreateModal}
        onHide={handleCloseCreateModal}
        onCreateSuccess={handleCreateSuccess}
      />
    </div>
  )
}
