import { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function MinhasInformacoes() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
  })
  const [loading, setLoading] = useState(true)
  const { token, user, setUser } = useAuth()

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        rua: user.rua || '',
        numero: user.numero || '',
        bairro: user.bairro || '',
        cidade: user.cidade || '',
        uf: user.uf || '',
      })
      setLoading(false)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    // Converte UF para maiúsculas enquanto digita
    const finalValue = name === 'uf' ? value.toUpperCase() : value
    setFormData({ ...formData, [name]: finalValue })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/profile/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao atualizar.')
      }
      const updatedUser = await response.json()
      setUser((prevUser) => ({ ...prevUser, ...updatedUser }))
      Swal.fire('Sucesso!', 'Suas informações foram atualizadas.', 'success')
    } catch (error) {
      Swal.fire(
        'Erro!',
        error.message || 'Não foi possível atualizar suas informações.',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user)
    return (
      <div className="p-4 text-center">
        <Spinner animation="border" />
      </div>
    )

  return (
    <div className="p-4">
      <h2 className="mb-4">Minhas Informações</h2>
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
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <h4 className="h5 mt-4 mb-3">Endereço</h4>

        <Row>
          <Col md={9}>
            <Form.Group className="mb-3">
              <Form.Label>Rua</Form.Label>
              <Form.Control
                type="text"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <Form.Group className="mb-3">
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>UF</Form.Label>
              <Form.Control
                type="text"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                maxLength="2"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" className="btn-principal mt-3" disabled={loading}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </Form>
    </div>
  )
}
