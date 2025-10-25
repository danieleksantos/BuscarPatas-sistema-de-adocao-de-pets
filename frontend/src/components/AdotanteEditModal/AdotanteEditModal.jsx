import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function AdotanteEditModal({ show, onHide, adotante, onUpdateSuccess }) {
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    role: 'USER',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (adotante) {
      setFormData({
        nome: adotante.nome || '',
        email: adotante.email || '',
        telefone: adotante.telefone || '',
        role: adotante.role || 'USER',
      })
    }
  }, [adotante])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(
        `${API_URL}/adotantes/${adotante.adotante_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao atualizar o adotante.')
      }

      const updatedAdotante = await response.json()

      onUpdateSuccess(updatedAdotante)

      onHide() // Fecha o modal
      Swal.fire('Sucesso!', 'Adotante atualizado com sucesso!', 'success')
    } catch (error) {
      Swal.fire('Erro!', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil de {adotante?.nome}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Permissão</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Admin</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end mt-3">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancelar
            </Button>
            <Button type="submit" className="btn-principal" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Salvar Alterações'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
