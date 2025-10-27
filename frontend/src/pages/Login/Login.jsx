import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  InputGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
import { useAuth } from '../../contexts/AuthContext'
import './Login.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  })

  const [apiError, setApiError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('') // Estado para o erro do email

  const navigate = useNavigate()
  const { login } = useAuth()

  // Função `handleChange` para validar email
  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'email') {
      // Verifica se o e-mail tem "@" quando não está vazio
      if (value && !value.includes('@')) {
        setEmailError('Digite um e-mail válido (ex: email@example.com)')
      } else {
        setEmailError('') // Limpa o erro se o formato for válido ou o campo estiver vazio
      }
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError(null)

    // Validação final para garantir que não será enviado com erro visível
    if (emailError) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'E-mail ou senha inválidos.')
      }

      const { token } = await response.json()
      login(token) // Usa a função de login do contexto de autenticação

      const decodedUser = jwtDecode(token)

      Swal.fire({
        title: 'Login Bem-Sucedido!',
        text: 'Você será redirecionado para o seu painel.',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
      }).then(() => {
        // Redireciona para o dashboard correto
        if (decodedUser.role === 'ADMIN') {
          navigate('/dashboardAdmin')
        } else {
          navigate('/dashboardUser')
        }
      })
    } catch (err) {
      setApiError(err.message)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <div className="form-card">
            <h2 className="text-center mb-4">Acessar sua Conta</h2>
            <Form noValidate onSubmit={handleSubmit}>
              {apiError && <Alert variant="danger">{apiError}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seuemail@example.com"
                  required
                  isInvalid={!!emailError}
                />
                <Form.Control.Feedback type="invalid">
                  {emailError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  <InputGroup.Text
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <div className="d-grid mt-4">
                {/* Botão é desabilitado se houver erro no e-mail */}
                <Button
                  type="submit"
                  className="btn-principal"
                  disabled={!!emailError}
                >
                  Entrar
                </Button>
              </div>
              <div className="mt-3 text-center">
                <span>Não possui cadastro? </span>
                <Link to="/cadastro">Cadastre-se aqui!</Link>
              </div>

              <div className="divider-text my-4">
                <span>OU</span>
              </div>

              <div className="d-grid">
                <Button
                  variant="light"
                  className="btn-google"
                  onClick={handleGoogleLogin}
                >
                  <FontAwesomeIcon icon={faGoogle} className="me-2" />
                  Entrar com Google
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
