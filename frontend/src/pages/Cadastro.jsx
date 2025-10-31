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

const checkPasswordStrength = (password) => {
  let score = 0
  if (!password) return { score: 0, label: '', color: '' }

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

const mascaraTelefone = (value) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value.slice(0, 15)
}

const formatarCEP = (value) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  return value.slice(0, 8)
}

export function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cep: '',
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
  const [loadingCep, setLoadingCep] = useState(false)
  const [cepError, setCepError] = useState(null)
  const [manualEntry, setManualEntry] = useState(false)

  const navigate = useNavigate()

  // Função para habilitar a entrada manual de endereço
  const handleManualEntry = () => {
    setManualEntry(true)
    setCepError(null)
    setFormData((prev) => ({
      ...prev,
      rua: '',
      bairro: '',
      cidade: '',
      uf: '',
    }))
  }

  // busca de CEP (ViaCEP)
  const searchCep = async (cepValue) => {
    const cleanCep = cepValue

    if (cleanCep.length !== 8) return

    setLoadingCep(true)
    setCepError(null)
    setManualEntry(false)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setCepError('CEP não encontrado ou inválido.')
        setFormData((prev) => ({
          ...prev,
          rua: '',
          bairro: '',
          cidade: '',
          uf: '',
        }))
        return
      }

      setManualEntry(false)

      // Atualiza o formData com os dados do ViaCEP
      setFormData((prev) => ({
        ...prev,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        uf: data.uf || '',
      }))
    } catch (error) {
      setCepError('Erro ao buscar o CEP. Tente novamente.')
    } finally {
      setLoadingCep(false)
    }
  }

  useEffect(() => {
    if (formData.confirmarSenha && formData.senha !== formData.confirmarSenha) {
      setConfirmError('As senhas não coincidem.')
    } else {
      setConfirmError('')
    }
  }, [formData.senha, formData.confirmarSenha])

  const handleChange = (event) => {
    const { name, value } = event.target

    let updatedFormData = { ...formData, [name]: value }
    let newValue = value

    if (name === 'telefone') {
      newValue = mascaraTelefone(value)
      updatedFormData = { ...formData, [name]: newValue }
    } else if (name === 'cep') {
      newValue = formatarCEP(value)
      updatedFormData = { ...formData, [name]: newValue }

      // Só busca se tiver 8 dígitos E não estiver em modo manual
      if (newValue.length === 8 && !manualEntry) {
        searchCep(newValue)
      } else if (newValue.length < 8) {
        setCepError(null)
      }
    } else if (name === 'email') {
      if (value && !value.includes('@')) {
        setEmailError('Digite um e-mail válido (ex: email@example.com)')
      } else {
        setEmailError('')
      }
    } else if (name === 'senha') {
      setPasswordStrength(checkPasswordStrength(value))
    }

    setFormData(updatedFormData)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError(null)

    if (formData.senha !== formData.confirmarSenha) {
      setConfirmError('As senhas não coincidem.')
      return
    }
    if (passwordStrength.score < 40) {
      setApiError('A senha é muito fraca.')
      return
    }

    if (!manualEntry && formData.cep.length !== 8) {
      setApiError(
        'Por favor, digite um CEP válido com 8 dígitos ou use a opção manual.',
      )
      return
    }

    try {
      const payload = {
        ...formData,
        telefone: formData.telefone.replace(/\D/g, ''),
        cep: formData.cep,
      }
      delete payload.confirmarSenha

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

  const shouldDisableAddressFields = !manualEntry && formData.cep.length === 8

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
                      type={showConfirmPassword ? 'text' : 'password'}
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

                <Form.Group className="mb-3">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="Somente 8 dígitos"
                    maxLength="8"
                    isInvalid={!!cepError}
                    disabled={loadingCep}
                    required
                  />
                  {loadingCep && (
                    <Form.Text className="text-muted">
                      Buscando endereço...
                    </Form.Text>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {cepError}
                  </Form.Control.Feedback>
                </Form.Group>

                {cepError && (
                  <div className="d-grid mb-3">
                    <Button
                      variant="outline-secondary"
                      onClick={handleManualEntry}
                      size="sm"
                    >
                      CEP Não Reconhecido? Preencha Manualmente.
                    </Button>
                  </div>
                )}

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
                        disabled={loadingCep || shouldDisableAddressFields}
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
                        disabled={loadingCep}
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
                        disabled={loadingCep || shouldDisableAddressFields}
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
                        disabled={loadingCep || shouldDisableAddressFields}
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
                        disabled={loadingCep || shouldDisableAddressFields}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid mt-4">
                  <Button
                    type="submit"
                    className="btn-principal"
                    disabled={!!confirmError || !!emailError || loadingCep}
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
