import { Form, Button, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function PetFilters({
  onFilterChange,
  onClear,
  showStatusFilter = false,
  className = '',
}) {
  const [especies, setEspecies] = useState([])

  useEffect(() => {
    async function fetchEspecies() {
      try {
        const response = await fetch(`${API_URL}/pets/especies`)
        if (!response.ok) {
          throw new Error('Falha ao carregar espécies')
        }
        const data = await response.json()
        setEspecies(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchEspecies()
  }, [])

  const handleFilter = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    const filters = {}
    const tamanho = formData.get('tamanho')
    const personalidade = formData.get('personalidade')
    const especie = formData.get('especie')
    const nome = formData.get('nome')
    const status = showStatusFilter ? formData.get('status') : undefined

    if (tamanho) filters.tamanho = tamanho
    if (personalidade) filters.personalidade = personalidade
    if (especie) filters.especie = especie
    if (nome) filters.nome = nome
    if (status) filters.status = status

    onFilterChange(filters)
  }

  const handleClear = (e) => {
    const form = e.target.closest('form')
    if (form) {
      form.reset()
    }
    if (onClear) {
      onClear()
    } else {
      onFilterChange({})
    }
  }

  const adminColSize = 3

  return (
    <Form
      onSubmit={handleFilter}
      className={`p-4 rounded shadow-sm bg-light ${className}`}
    >
      {showStatusFilter && (
        <>
          <Row className="align-items-end g-3 mb-3">
            <Col md={6}>
              <Form.Group controlId="nomeFiltroAdmin">
                <Form.Label className="fw-bold">Nome</Form.Label>
                <Form.Control type="text" name="nome" placeholder="Ex: Bob" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="especieFiltroAdmin">
                <Form.Label className="fw-bold">Espécie</Form.Label>
                <Form.Select name="especie">
                  <option value="">Todas</option>
                  {especies.map((esp) => (
                    <option key={esp} value={esp}>
                      {capitalize(esp)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="align-items-end g-3">
            <Col md={adminColSize}>
              <Form.Group controlId="tamanhoFiltroAdmin">
                <Form.Label className="fw-bold">Tamanho</Form.Label>
                <Form.Select name="tamanho">
                  <option value="">Todos</option>
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={adminColSize}>
              <Form.Group controlId="personalidadeFiltroAdmin">
                <Form.Label className="fw-bold">Personalidade</Form.Label>
                <Form.Select name="personalidade">
                  <option value="">Todas</option>
                  <option value="CALMO">Calmo</option>
                  <option value="BRINCALHAO">Brincalhão</option>
                  <option value="INDEPENDENTE">Independente</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={adminColSize}>
              <Form.Group controlId="statusFiltro">
                <Form.Label className="fw-bold">Status</Form.Label>
                <Form.Select name="status">
                  <option value="">Todos</option>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="ADOTADO">Adotado</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={adminColSize} className="d-flex">
              <Button
                type="button"
                variant="outline-secondary"
                className="w-100 me-2"
                onClick={handleClear}
              >
                {' '}
                Limpar{' '}
              </Button>
              <Button type="submit" className="btn-principal w-100">
                {' '}
                Filtrar{' '}
              </Button>
            </Col>
          </Row>
        </>
      )}

      {!showStatusFilter && (
        <Row className="align-items-end g-3">
          <Col md={2}>
            <Form.Group controlId="nomeFiltroUser">
              <Form.Label className="fw-bold">Nome</Form.Label>
              <Form.Control type="text" name="nome" placeholder="Ex: Bob" />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="especieFiltroUser">
              <Form.Label className="fw-bold">Espécie</Form.Label>
              <Form.Select name="especie">
                <option value="">Todas</option>
                {especies.map((esp) => (
                  <option key={esp} value={esp}>
                    {capitalize(esp)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="tamanhoFiltroUser">
              <Form.Label className="fw-bold">Tamanho</Form.Label>
              <Form.Select name="tamanho">
                <option value="">Todos</option>
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="personalidadeFiltroUser">
              <Form.Label className="fw-bold">Personalidade</Form.Label>
              <Form.Select name="personalidade">
                <option value="">Todas</option>
                <option value="CALMO">Calmo</option>
                <option value="BRINCALHAO">Brincalhão</option>
                <option value="INDEPENDENTE">Independente</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex">
            <Button
              type="button"
              variant="outline-secondary"
              className="w-50 me-2"
              onClick={handleClear}
            >
              {' '}
              Limpar{' '}
            </Button>
            <Button type="submit" className="btn-principal w-50">
              {' '}
              Filtrar{' '}
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  )
}
