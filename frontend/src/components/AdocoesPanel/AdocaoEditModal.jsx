import { useState, useEffect } from 'react'
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function AdocaoEditModal({ show, onHide, adocao, onUpdateSuccess }) {
  const [petsDisponiveis, setPetsDisponiveis] = useState([])
  const [novoPetId, setNovoPetId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (show) {
      const fetchPetsDisponiveis = async () => {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch(`${API_URL}/pets/disponiveis`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!response.ok) throw new Error('Falha ao buscar pets disponíveis.')

          const data = await response.json()
          setPetsDisponiveis(data)
          setNovoPetId(adocao.pet_id)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchPetsDisponiveis()
    }
  }, [show, adocao, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!novoPetId || novoPetId === adocao.pet_id) {
      onHide()
      return
    }

    try {
      const response = await fetch(`${API_URL}/adocoes/${adocao.adocao_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pet_id: parseInt(novoPetId) }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Falha ao atualizar adoção.')
      }

      Swal.fire('Sucesso!', 'A adoção foi atualizada.', 'success')
      onUpdateSuccess()
      onHide()
    } catch (err) {
      Swal.fire('Erro!', err.message, 'error')
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Pet da Adoção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p>
            <strong>Adotante:</strong> {adocao?.adotante.nome}
          </p>
          <hr />
          <Form.Group controlId="petSelect">
            <Form.Label>Selecione o novo pet:</Form.Label>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Form.Select
                value={novoPetId}
                onChange={(e) => setNovoPetId(e.target.value)}
              >
                {/* Opção para o pet que JÁ está na adoção */}
                <option value={adocao?.pet_id}>
                  Atual: {adocao?.pet.nome} ({adocao?.pet.especie})
                </option>
                <option disabled>--- PETS DISPONÍVEIS ---</option>

                {/* Lista de outros pets disponíveis */}
                {petsDisponiveis
                  .filter((pet) => pet.pet_id !== adocao?.pet_id)
                  .map((pet) => (
                    <option key={pet.pet_id} value={pet.pet_id}>
                      {pet.nome} ({pet.especie})
                    </option>
                  ))}
              </Form.Select>
            )}
          </Form.Group>
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
            Salvar Alteração
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
