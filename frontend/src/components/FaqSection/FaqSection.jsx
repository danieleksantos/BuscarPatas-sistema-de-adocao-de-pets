import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import './FaqSection.css'

const faqItems = [
  {
    id: 'collapseOne',
    question: 'Temos pets de todas as idades?',
    answer:
      'Sim, nosso site busca conectar lares a pets de todas as idades, desde filhotes até idosos, cada um com seu charme e necessidades únicas. O amor não tem idade!',
  },
  {
    id: 'collapseTwo',
    question: 'Como funciona o processo de adoção do animal?',
    answer:
      'O processo começa com a manifestação de interesse. Você preenche um formulário, participa de uma entrevista para avaliação do lar e, se aprovado, finalizamos com a assinatura do termo de responsabilidade e a entrega do novo membro da família.',
  },
  {
    id: 'collapseThree',
    question: 'É preciso pagar alguma taxa para a adoção?',
    answer: 'Não! A adoção de pets em nosso sistema é totalmente gratuita.',
  },
  {
    id: 'collapseFour',
    question: 'Quem pode adotar um animal?',
    answer:
      'Qualquer pessoa maior de 18 anos, que demonstre responsabilidade, estabilidade e a capacidade de fornecer um ambiente seguro, amoroso e com todos os cuidados necessários (alimentação, saúde e lazer) para o pet.',
  },
  {
    id: 'collapseFive',
    question: 'Esses pets já são vacinados e castrados?',
    answer:
      'Priorizamos a saúde animal. A grande maioria dos pets adultos estão castrados e com o protocolo de vacinas em dia. Essa informação é sempre detalhada e garantida na ficha individual de cada animal disponível para adoção.',
  },
  {
    id: 'collapseSix',
    question: 'Posso devolver o pet se não me adaptar?',
    answer:
      'Entendemos que a adaptação leva tempo, mas a adoção é um ato de compromisso. Caso haja problemas graves e inevitáveis, pedimos que entre em contato imediatamente com a nossa ONG para encontrarmos uma solução e, se necessário, o pet será reencaminhado, nunca abandonado.',
  },
]

export function FAQSection() {
  return (
    <section className="container py-5 my-5">
      <h2 className="text-center mb-5 display-4 fw-light" id="faq">
        Tem alguma dúvida
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="faq-title-icon me-3"
        />
      </h2>

      <div className="accordion" id="faqAccordion">
        {faqItems.map((item, index) => (
          <div className="accordion-item" key={item.id}>
            <h3 className="accordion-header" id={`heading${item.id}`}>
              <button
                className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${item.id}`}
                aria-expanded={index === 0 ? 'true' : 'false'}
                aria-controls={item.id}
              >
                <FontAwesomeIcon
                  icon={faPaw}
                  className="faq-paw-icon me-3"
                  aria-hidden="true"
                />

                <strong className="text-dark">{item.question}</strong>
              </button>
            </h3>

            <div
              id={item.id}
              className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
              aria-labelledby={`heading${item.id}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body text-secondary">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
