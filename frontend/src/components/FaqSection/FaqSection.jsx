import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPaw,
  faQuestionCircle,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
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

export function FaqSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar a mensagem.')
      }

      Swal.fire({
        title: 'Mensagem Enviada!',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'Ok',
      })

      setFormData({ name: '', email: '', message: '' })
      setLoading(false)
    } catch (error) {
      console.error('Erro de envio:', error)

      Swal.fire({
        title: 'Falha no Envio!',
        text:
          error.message || 'Falha na conexão com o servidor. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
      })

      setLoading(false)
    }
  }

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

      <div className="row mt-5 pt-5 justify-content-center">
        <div className="col-12 col-lg-8">
          <h3 className="text-center mb-4">
            Ainda com dúvidas?
            <FontAwesomeIcon icon={faEnvelope} className="ms-3" />
          </h3>
          <p className="text-center mb-4 text-secondary">
            Envie-nos sua pergunta! Nossa equipe responderá o mais rápido
            possível.
          </p>
          <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nome
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Sua Mensagem
              </label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-principal"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Pergunta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
