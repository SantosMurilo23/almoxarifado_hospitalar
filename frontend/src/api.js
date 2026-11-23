export async function consultarApi(caminho) {
  const resposta = await fetch(`${import.meta.env.VITE_API_URL}${caminho}`)

  if (!resposta.ok) {
    throw new Error(`Erro ao consultar ${caminho}: HTTP ${resposta.status}`)
  }

  return resposta.json()
}