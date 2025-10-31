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
        // Sua lógica existente para buscar espécies
        const response = await fetch(`${API_URL}/pets/especies`)
        if (!response.ok) {
          throw new Error('Falha ao carregar espécies')
        }
        const data = await response.json()
        setEspecies(data) // Ex: ['CACHORRO', 'GATO']
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
    // === ALTERAÇÃO 1: COLETAR NOVO FILTRO ===
    const sexo = formData.get('sexo')
    // =======================================
    const status = showStatusFilter ? formData.get('status') : undefined

    if (tamanho) filters.tamanho = tamanho
    if (personalidade) filters.personalidade = personalidade
    if (especie) filters.especie = especie
    if (nome) filters.nome = nome
    // === ALTERAÇÃO 1.1: ADICIONAR NOVO FILTRO À LISTA ===
    if (sexo) filters.sexo = sexo
    // ====================================================
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
  const userColSize = 2 // Usando md={2} para cada um dos 5 filtros de usuário (2*5=10/12)

  return (
    <Form
      onSubmit={handleFilter}
      className={`p-4 rounded shadow-sm bg-light ${className}`}
    >
      {/* ----------------------------------------------------- */}
      {/* ---------- SEÇÃO ADMIN (showStatusFilter: true) --------- */}
      {/* ----------------------------------------------------- */}
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
            {/* Mantém 3 colunas para Tamanho, Personalidade e Status */}
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

            {/* === ALTERAÇÃO 2: NOVO FILTRO DE SEXO PARA ADMIN === */}
            <Col md={adminColSize}>
              <Form.Group controlId="sexoFiltroAdmin">
                <Form.Label className="fw-bold">Sexo</Form.Label>
                <Form.Select name="sexo">
                  <option value="">Ambos</option>
                  {/* Enviando em MAIÚSCULAS para consistência com outros filtros */}
                  <option value="MACHO">Macho</option>
                  <option value="FEMEA">Fêmea</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* ==================================================== */}

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

            {/* Ajuste o layout dos botões se precisar */}
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

      {/* ----------------------------------------------------- */}
      {/* ---------- SEÇÃO USUÁRIO (showStatusFilter: false) --------- */}
      {/* ----------------------------------------------------- */}
      {!showStatusFilter && (
        <Row className="align-items-end g-3">
          {/* Nome */}
          <Col md={userColSize}>
            <Form.Group controlId="nomeFiltroUser">
              <Form.Label className="fw-bold">Nome</Form.Label>
              <Form.Control type="text" name="nome" placeholder="Ex: Bob" />
            </Form.Group>
          </Col>
          {/* Espécie */}
          <Col md={userColSize}>
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
          {/* Tamanho */}
          <Col md={userColSize}>
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
          {/* Personalidade */}
          <Col md={userColSize}>
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

          {/* === ALTERAÇÃO 3: NOVO FILTRO DE SEXO PARA USUÁRIO === */}
          <Col md={userColSize}>
            <Form.Group controlId="sexoFiltroUser">
              <Form.Label className="fw-bold">Sexo</Form.Label>
              <Form.Select name="sexo">
                <option value="">Ambos</option>
                {/* Enviando em MAIÚSCULAS para consistência com outros filtros */}
                <option value="MACHO">Macho</option>
                <option value="FEMEA">Fêmea</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {/* ======================================================= */}

          {/* Botões - Ocupa as 2 colunas restantes (12 - 5*2 = 2) */}
          <Col md={2} className="d-flex">
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
