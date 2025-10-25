const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function buscarPatas() {
  const response = await fetch(`${API_URL}/minha-rota-de-pets`)
  if (!response.ok) {
    throw new Error(`Falha ao buscar pets`)
  }
  return response.json()
}

export { API_URL }
