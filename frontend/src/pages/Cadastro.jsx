import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  ProgressBar,
  InputGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Footer } from '../components/Footer/Footer'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Função para verificar a força da senha
const checkPasswordStrength = (password) => {
  let score = 0
  if (!password) return { score: 0, label: '', color: '' }

  // Adiciona pontos com base nos critérios
  if (password.length >= 8) score++
  if (password.match(/[a-z]/)) score++
  if (password.match(/[A-Z]/)) score++
  if (password.match(/[0-9]/)) score++
  if (password.match(/[^A-Za-z0-9]/)) score++

  switch (score) {
    case 1:
    case 2:
      return { score: score * 20, label: 'Fraca', color: 'danger' }
    case 3:
      return { score: score * 20, label: 'Média', color: 'warning' }
    case 4:
    case 5:
      return { score: score * 20, label: 'Forte', color: 'success' }
    default:
      return { score: 0, label: '', color: '' }
  }
}

// Função para aplicar a máscara de telefone
const mascaraTelefone = (value) => {
  if (!value) return ''
  value = value.replace(/\D/g, '') // Remove tudo que não é dígito
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
  value = value.replace(/(\d)(\d{4})$/, '$1-$2') // Coloca hífen antes dos últimos 4 dígitos
  return value.slice(0, 15) // Limita o tamanho máximo do campo
}

export function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
  })

  // Estados para validação e feedback
  const [apiError, setApiError] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
  })
  const [confirmError, setConfirmError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  // Efeito para validar a confirmação de senha
  useEffect(() => {
    if (formData.confirmarSenha && formData.senha !== formData.confirmarSenha) {
      setConfirmError('As senhas não coincidem.')
    } else {
      setConfirmError('')
    }
  }, [formData.senha, formData.confirmarSenha])

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'telefone') {
      setFormData({ ...formData, [name]: mascaraTelefone(value) })
    } else if (name === 'email') {
      if (value && !value.includes('@')) {
        setEmailError('Digite um e-mail válido (ex: email@example.com)')
      } else {
        setEmailError('')
      }
      setFormData({ ...formData, [name]: value })
    } else if (name === 'senha') {
      setPasswordStrength(checkPasswordStrength(value))
      setFormData({ ...formData, [name]: value })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError(null)

    // Validação final antes de enviar
    if (formData.senha !== formData.confirmarSenha) {
      setConfirmError('As senhas não coincidem.')
      return
    }
    if (passwordStrength.score < 40) {
      setApiError('A senha é muito fraca.')
      return
    }

    try {
      // Prepara os dados para enviar para a API
      const payload = {
        ...formData,
        telefone: formData.telefone.replace(/\D/g, ''), // Envia apenas os números do telefone
      }
      delete payload.confirmarSenha // Remove o campo de confirmação

      // CORREÇÃO: Usando API_URL para a rota de registro
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao cadastrar.')
      }

      Swal.fire({
        title: 'Cadastro Realizado!',
        text: 'Você será redirecionado para a página de login.',
        icon: 'success',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: 'Ir para o Login',
        willClose: () => {
          navigate('/login')
        },
      }).then(() => {
        navigate('/login')
      })
    } catch (err) {
      setApiError(err.message)
    }
  }

  return (
    <>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="form-card">
              <h2 className="text-center mb-4">Crie sua Conta</h2>
              <Form noValidate onSubmit={handleSubmit}>
                {apiError && <Alert variant="danger">{apiError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    isInvalid={!!emailError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError || 'Por favor, insira um e-mail válido.'}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'} // Alterna o tipo do campo
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                    />
                    <InputGroup.Text
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </InputGroup.Text>
                  </InputGroup>
                  {formData.senha && (
                    <ProgressBar
                      now={passwordStrength.score}
                      variant={passwordStrength.color}
                      label={passwordStrength.label}
                      className="mt-2"
                      style={{ height: '10px' }}
                    />
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'} // Alterna o tipo do campo
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      required
                      isInvalid={!!confirmError}
                    />
                    <InputGroup.Text
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {confirmError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(XX) XXXXX-XXXX"
                    required
                  />
                </Form.Group>

                <hr />

                <h4 className="h5 mt-4 mb-3">Endereço</h4>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rua</Form.Label>
                      <Form.Control
                        type="text"
                        name="rua"
                        value={formData.rua}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
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
                        required
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
                        required
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
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid mt-4">
                  <Button
                    type="submit"
                    className="btn-principal"
                    disabled={!!confirmError || !!emailError}
                  >
                    Cadastrar
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  )
}
