import { useState } from 'react'
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function PetCreatePanel({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    data_nascimento: '',
    descricao: '',
    tamanho: 'PEQUENO',
    personalidade: 'CALMO',
    sexo: 'FEMEA',
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    } else {
      setImageFile(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    const data = new FormData()

    Object.keys(formData).forEach((key) => {
      if (
        formData[key] ||
        key === 'tamanho' ||
        key === 'personalidade' ||
        key === 'sexo' ||
        key === 'data_nascimento'
      ) {
        data.append(key, formData[key])
      }
    })
    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
      const response = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao cadastrar.')
      }

      Swal.fire('Sucesso!', 'Pet cadastrado!', 'success').then(() => {
        onSuccess()
      })
    } catch (error) {
      Swal.fire('Erro!', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Pet*</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sexo*</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Fêmea"
                  name="sexo"
                  value="FEMEA"
                  checked={formData.sexo === 'FEMEA'}
                  onChange={handleChange}
                  required
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Macho"
                  name="sexo"
                  value="MACHO"
                  checked={formData.sexo === 'MACHO'}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Espécie*</Form.Label>
              <Form.Control
                type="text"
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Data Nasc. (Aprox.)</Form.Label>
              <Form.Control
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Tamanho</Form.Label>
              <Form.Select
                name="tamanho"
                value={formData.tamanho}
                onChange={handleChange}
              >
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Personalidade</Form.Label>
              <Form.Select
                name="personalidade"
                value={formData.personalidade}
                onChange={handleChange}
              >
                <option value="CALMO">Calmo</option>
                <option value="BRINCALHAO">Brincalhão</option>
                <option value="INDEPENDENTE">Independente</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Imagem Principal (Opcional)</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-end mt-3">
          <Button variant="secondary" onClick={onCancel} className="me-2">
            Cancelar
          </Button>
          <Button type="submit" className="btn-principal" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Cadastrar Pet'}
          </Button>
        </div>
      </Form>
    </>
  )
}
