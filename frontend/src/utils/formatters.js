// Função para transformar a primeira letra de uma string em maiúscula
export const capitalizeFirstLetter = (string) => {
  if (!string) return '' // Retorna string vazia se a entrada for nula ou vazia
  return string.charAt(0).toUpperCase() + string.slice(1)
}
