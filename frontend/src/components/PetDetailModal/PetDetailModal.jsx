import { Modal, Button, Row, Col, Carousel, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../contexts/AuthContext'
import { capitalizeFirstLetter } from '../../utils/formatters'

const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return 'Idade não informada'
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let anos = hoje.getFullYear() - nascimento.getFullYear()
  let meses = hoje.getMonth() - nascimento.getMonth()
  if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
    anos--
    meses += 12
  }
  if (anos === 0 && meses === 0) return 'Menos de 1 mês'
  const idadeAnos = anos > 0 ? `${anos} ${anos > 1 ? 'anos' : 'ano'}` : ''
  const idadeMeses = meses > 0 ? `${meses} ${meses > 1 ? 'meses' : 'mês'}` : ''
  return [idadeAnos, idadeMeses].filter(Boolean).join(' e ')
}

export function PetDetailModal({ show, onHide, pet, onAdocaoConcluida }) {
  if (!pet) return null

  const { isAuthenticated, user, token } = useAuth()
  const navigate = useNavigate()

  const handleAdotarClick = async () => {
    if (!isAuthenticated) {
      onHide()
      Swal.fire({
        title: 'Quase lá!',
        text: 'Para adotar um pet, você precisa estar logado!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: 'var(--cor-laranja)',
        cancelButtonText: 'Depois',
        confirmButtonText: 'Entrar na conta',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login')
        }
      })
      return
    }

    Swal.fire({
      title: `Adotar ${pet.nome}?`,
      text: 'Você tem certeza que quer dar um lar para este amigo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--cor-verde)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero adotar!',
      cancelButtonText: 'Ainda não',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost:3000/adocoes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              pet_id: pet.pet_id,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
              errorData.error || 'Não foi possível registrar a adoção.',
            )
          }

          Swal.fire({
            title: 'Parabéns!',
            text: `${pet.nome} agora tem um novo lar! A ONG responsável entrará em contato em breve.`,
            icon: 'success',
            confirmButtonColor: 'var(--cor-azul)',
          })

          onAdocaoConcluida()
        } catch (err) {
          Swal.fire({
            title: 'Ops! Algo deu errado.',
            text: err.message,
            icon: 'error',
          })
        }
      }
    })
  }

  const idade = calcularIdade(pet.data_nascimento)
  const imagens = [pet.imagem_url1, pet.imagem_url2].filter(Boolean)

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {capitalizeFirstLetter(pet.nome)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            {imagens.length > 0 ? (
              <Carousel>
                {imagens.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100 rounded"
                      src={url}
                      alt={`Foto ${index + 1} de ${pet.nome}`}
                      style={{ height: '400px', objectFit: 'cover' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <img
                className="d-block w-100 rounded"
                src="https://via.placeholder.com/400x400?text=Sem+Foto"
                alt="Sem foto"
                style={{ height: '400px', objectFit: 'cover' }}
              />
            )}
          </Col>
          <Col md={6}>
            <h4 className="mt-3 mt-md-0">Detalhes</h4>
            <p>
              <strong>Espécie:</strong> {capitalizeFirstLetter(pet.especie)}
            </p>
            <p>
              <strong>Idade Aproximada:</strong> {idade}
            </p>
            <p>
              <strong>Tamanho:</strong> {pet.tamanho || 'Não informado'}
            </p>
            <p>
              <strong>Descrição:</strong> {pet.descricao}
            </p>
            <div>
              {pet.personalidade && (
                <Badge bg="success" className="p-2">
                  {pet.personalidade}
                </Badge>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        <Button
          variant="primary"
          className="btn-principal"
          onClick={handleAdotarClick}
        >
          Quero Adotar!
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
