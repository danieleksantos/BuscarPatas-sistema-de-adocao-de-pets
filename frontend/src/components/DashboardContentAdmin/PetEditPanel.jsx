import { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Spinner, Image } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../../contexts/AuthContext'
import logoBuscarPatas from '../../assets/logo.png'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function PetEditPanel({ pet, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [newImageFile, setNewImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (pet) {
      setFormData({
        nome: pet.nome || '',
        especie: pet.especie || '',
        descricao: pet.descricao || '',
        data_nascimento: pet.data_nascimento
          ? pet.data_nascimento.split('T')[0]
          : '',
        tamanho: pet.tamanho || 'PEQUENO',
        personalidade: pet.personalidade || 'CALMO',
        status: pet.status || 'DISPONIVEL',
      })
      setNewImageFile(null)
      setImagePreview(null)
    }
  }, [pet])

  const handleNewFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setNewImageFile(null)
      setImagePreview(null)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) {
        data.append(key, formData[key] === null ? '' : formData[key])
      }
    })
    if (newImageFile) {
      data.append('image', newImageFile)
    }

    try {
      const response = await fetch(`${API_URL}/pets/${pet.pet_id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao atualizar o pet.')
      }
      Swal.fire('Sucesso!', 'Pet atualizado!', 'success').then(() => {
        onSuccess()
      }) // Chama onSuccess (do Stashed changes)
    } catch (error) {
      Swal.fire('Erro!', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (!pet) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <>
      {/* Formulário de Edição */}
      <Form onSubmit={handleUpdate}>
        {/* Linha Nome / Espécie */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome*</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome || ''}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Espécie*</Form.Label>
              <Form.Control
                type="text"
                name="especie"
                value={formData.especie || ''}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        {/* Descrição */}
        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descricao"
            value={formData.descricao || ''}
            onChange={handleFormChange}
          />
        </Form.Group>
        {/* Linha Data Nasc / Tamanho / Personalidade */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Data Nasc.</Form.Label>
              <Form.Control
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento || ''}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Tamanho</Form.Label>
              <Form.Select
                name="tamanho"
                value={formData.tamanho || 'PEQUENO'}
                onChange={handleFormChange}
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
                value={formData.personalidade || 'CALMO'}
                onChange={handleFormChange}
              >
                <option value="CALMO">Calmo</option>
                <option value="BRINCALHAO">Brincalhão</option>
                <option value="INDEPENDENTE">Independente</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {/* Linha Status */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status || 'DISPONIVEL'}
                onChange={handleFormChange}
              >
                <option value="DISPONIVEL">Disponível</option>
                <option value="ADOTADO">Adotado</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Campo de Alteração de Imagem */}
        <Form.Group className="mb-3">
          <Form.Label>Alterar Imagem Principal (Opcional)</Form.Label>
          <div className="mb-2 text-center" style={{ minHeight: '100px' }}>
            <Image
              src={imagePreview || pet.imagem_url1 || logoBuscarPatas}
              alt={
                imagePreview
                  ? 'Nova imagem'
                  : pet.imagem_url1
                    ? 'Imagem atual'
                    : 'Logo Buscar Patas'
              }
              thumbnail
              style={{
                maxWidth: '100px',
                maxHeight: '100px',
                objectFit:
                  imagePreview || pet.imagem_url1 ? 'cover' : 'contain',
                padding: imagePreview || pet.imagem_url1 ? '0' : '0.25rem',
              }}
            />
          </div>
          <Form.Control
            type="file"
            name="newImage"
            accept="image/*"
            onChange={handleNewFileChange}
          />
          <Form.Text muted>
            {' '}
            Selecione uma nova imagem para substituir a atual.{' '}
          </Form.Text>
        </Form.Group>

        {/* Botões de Ação */}
        <div className="d-flex justify-content-end mt-3">
          <Button variant="secondary" onClick={onCancel} className="me-2">
            {' '}
            Cancelar{' '}
          </Button>
          <Button type="submit" className="btn-principal" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Salvar Alterações'}
          </Button>
        </div>
      </Form>
    </>
  )
}
