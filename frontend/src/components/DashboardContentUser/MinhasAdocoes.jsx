import { useState, useEffect } from 'react'
import { Card, Col, Row, Spinner, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import logoBuscarPatas from '../../assets/logo.png'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const formatarData = (dataISO) => {
  if (!dataISO || typeof dataISO !== 'string') return 'Data inválida'
  try {
    const dataObj = new Date(dataISO)
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } catch (error) {
    console.error('Erro ao formatar data:', dataISO, error)
    return 'Erro na data'
  }
}

export function MinhasAdocoes() {
  const [adocoes, setAdocoes] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchAdocoes = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/adocoes/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          console.error('Erro ao buscar adoções:', response.statusText)
          setAdocoes([])
        } else {
          const data = await response.json()
          setAdocoes(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Erro de rede ou JSON:', error)
        setAdocoes([])
      } finally {
        setLoading(false)
      }
    }
    fetchAdocoes()
  }, [token])

  if (loading)
    return (
      <div className="p-4 text-center">
        <Spinner animation="border" />
      </div>
    )

  return (
    <div className="p-4">
      <h2 className="mb-4">Minhas Adoções</h2>
      {adocoes.length === 0 ? (
        <Alert variant="info">Você ainda não realizou nenhuma adoção.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {adocoes.map(
            (adocao) =>
              adocao &&
              adocao.pet && (
                <Col key={adocao.adocao_id}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={adocao.pet.imagem_url1 || logoBuscarPatas}
                      alt={
                        adocao.pet.imagem_url1
                          ? `Foto de ${adocao.pet.nome}`
                          : 'Logo Buscar Patas'
                      }
                      style={{
                        height: '180px',
                        objectFit: adocao.pet.imagem_url1 ? 'cover' : 'contain',
                        padding: adocao.pet.imagem_url1 ? '0' : '0.5rem',
                      }}
                    />
                    <Card.Body>
                      <Card.Title>
                        {adocao.pet.nome || 'Nome Indisponível'}
                      </Card.Title>
                      <Card.Text>
                        Adotado em: {formatarData(adocao.data_adocao)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ),
          )}
        </Row>
      )}
    </div>
  )
}
