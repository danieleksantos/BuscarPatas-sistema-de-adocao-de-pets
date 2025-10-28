import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function useAdoptionCount() {
  const [petsAdotados, setPetsAdotados] = useState('...')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/dashboard/public-counts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(
            `Falha ao carregar a contagem. Status: ${response.status}`,
          )
        }

        const data = await response.json()

        setPetsAdotados(data.petsAdotados || 0)
      } catch (err) {
        console.error('Erro na busca de contagem para o Banner:', err)
        setError(err.message)
        setPetsAdotados('0')
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [])

  return { petsAdotados, loading, error }
}
