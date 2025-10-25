import { useState, useEffect } from 'react'
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function AdocaoCreateModal({ show, onHide, onCreateSuccess }) {
  const [petsDisponiveis, setPetsDisponiveis] = useState([])
  const [todosAdotantes, setTodosAdotantes] = useState([])
  const [selectedPet, setSelectedPet] = useState('')
  const [selectedAdotante, setSelectedAdotante] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  // Busca pets E adotantes quando o modal é aberto
  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        setLoading(true)
        setError(null)
        // Limpa seleções antigas
        setSelectedPet('')
        setSelectedAdotante('')
        try {
          // Busca de dados em paralelo
          const [petsRes, adotantesRes] = await Promise.all([
            // 2. CORREÇÃO: Usando API_URL
            fetch(`${API_URL}/pets/disponiveis`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            // 3. CORREÇÃO: Usando API_URL
            fetch(`${API_URL}/adotantes`, {
              // Rota de admin
              headers: { Authorization: `Bearer ${token}` },
            }),
          ])

          if (!petsRes.ok) throw new Error('Falha ao buscar pets.')
          if (!adotantesRes.ok) throw new Error('Falha ao buscar adotantes.')

          const petsData = await petsRes.json()
          const adotantesData = await adotantesRes.json()

          setPetsDisponiveis(petsData)
          setTodosAdotantes(adotantesData)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [show, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPet || !selectedAdotante) {
      Swal.fire(
        'Atenção',
        'Você precisa selecionar um pet E um adotante.',
        'warning',
      )
      return
    }

    try {
      const response = await fetch(`${API_URL}/adocoes/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pet_id: parseInt(selectedPet),
          adotante_id: parseInt(selectedAdotante),
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Falha ao registrar adoção.')
      }

      Swal.fire('Sucesso!', 'Adoção registrada.', 'success')
      onCreateSuccess() // Chama a função do pai para atualizar a lista
      onHide() // Fechar o modal
    } catch (err) {
      Swal.fire('Erro!', err.message, 'error')
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Nova Adoção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Carregando pets e adotantes...</p>
            </div>
          ) : (
            <>
              {/* Seleção de Adotante */}
              <Form.Group controlId="adotanteSelect" className="mb-3">
                <Form.Label>Adotante</Form.Label>
                <Form.Select
                  value={selectedAdotante}
                  onChange={(e) => setSelectedAdotante(e.target.value)}
                  required
                >
                  <option value="">Selecione um adotante...</option>
                  {todosAdotantes.map((a) => (
                    <option key={a.adotante_id} value={a.adotante_id}>
                      {a.nome} ({a.auth?.email || 'Sem email'})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Seleção de Pet */}
              <Form.Group controlId="petSelect">
                <Form.Label>Pet Disponível</Form.Label>
                <Form.Select
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  required
                >
                  <option value="">Selecione um pet...</option>
                  {petsDisponiveis.map((p) => (
                    <option key={p.pet_id} value={p.pet_id}>
                      {p.nome} ({p.especie})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="btn-principal"
            disabled={loading}
          >
            Registrar Adoção
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
