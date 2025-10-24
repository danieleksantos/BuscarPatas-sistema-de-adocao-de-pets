import '../styles/global.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faPaw,
  faShieldAlt,
  faUsers,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons'
import { CtaBanner } from '../components/CtaBanner/CtaBanner'
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer/Footer'
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground'

export function Sobre() {
  const backgroundImageUrl = 'bg-cat.png'

  const mvvItems = [
    {
      icon: faHeart,
      title: 'Missão',
      text: 'Conectar pets abandonados e lares amorosos por meio de uma plataforma simples e segura, promovendo o bem-estar animal e a adoção responsável.',
      colorVar: 'var(--cor-azul)',
    },
    {
      icon: faShieldAlt,
      title: 'Visão',
      text: 'Ser a plataforma líder em adoção responsável no país, transformando a realidade de milhares de animais e inspirando uma cultura de cuidado e respeito.',
      colorVar: 'var(--cor-verde)',
    },
    {
      icon: faUsers,
      title: 'Valores',
      text: 'Transparência em todo o processo, Responsabilidade social, Compaixão e Dedicação à causa animal. Estes pilares guiam cada decisão que tomamos.',
      colorVar: 'var(--cor-laranja)',
    },
  ]

  return (
    <>
      <AnimatedBackground
        imageUrl={backgroundImageUrl}
        opacity={0.5}
        animationDuration="40s"
        backgroundSize="200px"
      />

      <main>
        <div className="text-center mb-5 container my-5">
          <h1
            className="display-4 fw-bold"
            style={{ color: 'var(--cor-azul)' }}
          >
            <FontAwesomeIcon icon={faPaw} className="me-3" />
            Sobre a Buscar Patas
          </h1>
          <p className="lead text-secondary mt-3">
            Nossa história, nossa paixão e o compromisso com a vida animal.
          </p>
        </div>

        {/* ... (Seção Nossa História) ... */}
        <section
          className="container pb-5"
          style={{
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <h2 className="fw-bold mb-3">Nossa História</h2>
              <p>
                A jornada da <span className="fw-bold">Buscar Patas</span>{' '}
                começou em 2023, não em uma sala de reuniões fria, mas nas
                trincheiras do resgate animal, onde o amor incondicional pelos
                pets se misturava à frustração constante. Éramos um grupo de
                voluntários, cada um com sua história de dedicação à causa, mas
                todos unidos por uma mesma dor: a dificuldade de fazer a conexão
                perfeita. Víamos animais incríveis, recuperados, saudáveis e
                cheios de vida, presos em abrigos ou lares temporários,
                enquanto, do outro lado, famílias amorosas buscavam um
                companheiro, mas se perdiam na burocracia e na desconfiança dos
                processos de adoção.
              </p>
              <p>
                Percebemos que o elo mais fraco não era o amor ou a vontade, mas
                sim a eficiência digital. Faltava uma ponte moderna, segura e
                transparente que unisse esses dois mundos. O modelo tradicional
                estava obsoleto; era lento, cheio de incertezas e, muitas vezes,
                inviabilizava adoções promissoras. Nossas conversas,
                inicialmente apenas desabafos sobre os desafios diários,
                evoluíram para um plano audacioso: criar uma plataforma digital
                que não apenas listasse animais, mas que gerenciasse todo o
                processo de forma inteligente. Assim nasceu a Buscar Patas: uma
                ferramenta concebida para agilizar o processo de adoção,
                tornando-o transparente para os voluntários e seguro para as
                famílias.
              </p>
              <p>
                Deixamos de lado as pilhas de papel e as infinitas trocas de
                e-mails para implementar um sistema de match baseado em perfis
                detalhados do animal e do adotante, garantindo compatibilidade
                de estilo de vida, temperamento e necessidades. Desde o nosso
                lançamento, o impacto tem sido transformador. O que antes levava
                semanas, agora pode ser resolvido em dias. Cada clique na nossa
                plataforma é um passo em direção a um lar definitivo. Com
                orgulho e muita emoção, afirmamos que já ajudamos centenas de
                pets a deixarem as grades para trás e encontrarem o conforto e a
                segurança de uma família. Na Buscar Patas, acreditamos que cada
                vida importa e que o amor tem o poder de mudar o destino de um
                animal resgatado. Mais do que uma plataforma, somos uma
                comunidade de esperança e um motor de transformação social,
                provando a cada dia que a tecnologia, quando movida pela paixão,
                é a chave para construir um futuro onde todos os patudos tenham
                um lar para chamar de seu. Nossa história é curta, mas o legado
                de amor que estamos construindo é imenso e continua a crescer a
                cada nova adoção bem-sucedida.
              </p>
            </div>
          </div>
        </section>
        {/* ... (Fim Seção Nossa História) ... */}

        <CtaBanner
          imageUrl="https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"
          imageAlt="O seu novo melhor amigo está te esperando"
          title="O seu novo melhor amigo está te esperando!"
          buttonText="Cadastre-se"
          buttonHref="/cadastro"
          reversed={true}
        />

        <section className="container mvv-section my-5">
          <h2
            className="text-center fw-bold mb-5"
            style={{ color: 'var(--cor-azul)' }}
          >
            Nossos Pilares
          </h2>

          <div className="container row g-4">
            {mvvItems.map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 text-center shadow-sm border-0 pt-4">
                  <div className="card-body d-flex flex-column align-items-center">
                    <FontAwesomeIcon
                      icon={item.icon}
                      size="3x"
                      className="mb-3"
                      style={{ color: item.colorVar }}
                    />

                    <h4 className="card-title fw-bold">{item.title}</h4>
                    <p className="card-text text-secondary">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- NOVO: BOTÃO DE HOMENAGEM AO BOOTCAMP --- */}
        <section className="container text-center my-5 pt-4">
          <h3 className="mb-4">Junte-se a nós nessa missão!</h3>
          <HashLink
            to="/#busca"
            className="btn btn-principal fw-bold me-3" // Adicionei 'me-3' (margin-end) para dar espaço
            scroll={(el) => {
              setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
          >
            Ver Pets para Adoção
          </HashLink>

          <Link to="/agradecimento" className="btn btn-outline-primary fw-bold">
            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
            Conheça nossos Mentores
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
