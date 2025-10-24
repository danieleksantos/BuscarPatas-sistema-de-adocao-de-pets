import { Container, Row, Col, Card } from 'react-bootstrap'
import '../styles/AgradecimentoInstrutores.css'
import { Footer } from '../components/Footer/Footer'

const instrutores = [
  {
    nome: 'Jheyele',
    area: 'Musa da Livelo que ama Front-end',
    fotoUrl:
      'https://media.licdn.com/dms/image/v2/D4D03AQG7LPzPSoAvNA/profile-displayphoto-shrink_800_800/B4DZRvCoSMHcAg-/0/1737029748866?e=1762992000&v=beta&t=wGpQYmFQVMLMY0hEyWmvpp2kwFe0PiyRPislEAj2lXM',
    depoimento:
      'Muitíssimo obrigada por todo o conteúdo impecável que nos apresentou, pela paciência com a nossa turma e parabéns pela sua didática!',
  },
  {
    nome: 'Joeldo',
    area: 'O Feiticeiro Fullstack',
    fotoUrl:
      'https://media.licdn.com/dms/image/v2/C4E03AQF-f88TPleARA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1572575452079?e=1762992000&v=beta&t=c-ZJNDjrNJJhQHCEp6KKZOeeR1hFdsbJ5qPwll9xbUo',
    depoimento:
      'Um agradecimento gigantesco por toda a sua contribuição e suporte durante o curso. Você fez a diferença em nossa jornada!',
  },
  {
    nome: 'Alyne',
    area: 'A Defensora da Qualidade Implacável',
    fotoUrl:
      'https://media.licdn.com/dms/image/v2/D4D03AQEH0K5nJir_5A/profile-displayphoto-shrink_800_800/B4DZYVoOdiGwAk-/0/1744119589191?e=1762992000&v=beta&t=cPdUdkL78JHIOCpnrE3_G7GzHomOQk511R294qSGB_g',
    depoimento:
      'Não teríamos chegado ao fim sem o seu suporte. Seu acompanhamento foi essencial para mantermos o foco e a qualidade! Gratidão!',
  },
]

function InstrutorCard({ nome, area, fotoUrl, depoimento }) {
  return (
    <Col lg={4} md={6} className="mb-4 d-flex px-5 px-md-3">
      <div className="instrutor-card-link-wrapper h-100 w-100">
        <Card className="instrutor-card h-100 shadow border-0 text-center">
          <div className="card-header-custom p-3">
            <img
              src={fotoUrl}
              alt={`Foto de ${nome}`}
              className="instrutor-foto"
            />
          </div>
          <Card.Body className="d-flex flex-column">
            <Card.Title className="text-info fw-bolder fs-4">{nome}</Card.Title>
            <Card.Subtitle className="mb-3 text-muted fw-bold">
              {area}
            </Card.Subtitle>
            <blockquote className="blockquote mb-0 mt-auto pt-3 border-start border-3 ps-3 text-start">
              <p className="depoimento-texto fst-italic">"{depoimento}"</p>
              <footer className="blockquote-footer mt-2">
                Seus Alunos (e Fãs!) do Avanti
              </footer>
            </blockquote>
          </Card.Body>
        </Card>
      </div>
    </Col>
  )
}

export function AgradecimentoInstrutores() {
  return (
    <>
      <div className="agradecimento-background">
        <main className="agradecimento-content">
          <Container className="py-5">
            <Row className="text-center mb-5">
              <Col>
                <h1 className="display-5 text-white fw-bold mb-3">
                  <span className="fw-bolder text-warning">
                    DEMODAY BOOTCAMP FULLSTACK 2025.3!
                  </span>{' '}
                  🎉
                </h1>
                <p className="lead text-light fst-italic">
                  Agradecemos à ATLANTICO AVANTI por nos proporcionar todo esse
                  aprendizado!
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              {instrutores.map((instrutor, index) => (
                <InstrutorCard
                  key={index}
                  nome={instrutor.nome}
                  area={instrutor.area}
                  fotoUrl={instrutor.fotoUrl}
                  depoimento={instrutor.depoimento}
                />
              ))}
            </Row>

            <Row className="text-center mb-0 mb-md-4">
              <Col>
                <p className="text-white fw-bold fs-5">
                  Missão dada é missão codificada! 🚀
                </p>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
      <Footer />
    </>
  )
}
