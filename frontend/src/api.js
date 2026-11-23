const apiUrl = import.meta.env.VITE_API_URL

export async function consultarApi(caminho) {
  const resposta = await fetch(`${apiUrl}${caminho}`)

  if (!resposta.ok) {
    throw new Error(`Erro ao consultar ${caminho}: HTTP ${resposta.status}`)
  }

  return resposta.json()
}

async function enviarDados(caminho, dados) {
  const resposta = await fetch(`${apiUrl}${caminho}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })

  if (!resposta.ok) {
    const mensagem = await resposta.text()
    throw new Error(mensagem || `Erro ao enviar dados: HTTP ${resposta.status}`)
  }

  return resposta.json()
}

export function criarRequisicao(dados) {
  return enviarDados('/requisicoes', dados)
}

export function atenderRequisicao(id, itens) {
  return enviarDados(`/requisicoes/${id}/atender`, { itens })
}