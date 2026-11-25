const apiUrl = import.meta.env.VITE_API_URL

// Centraliza as chamadas e apresenta as mensagens retornadas pela API.
async function executarRequisicao(caminho, metodo = 'GET', dados) {
  const opcoes = { method: metodo }

  if (dados !== undefined) {
    opcoes.headers = { 'Content-Type': 'application/json' }
    opcoes.body = JSON.stringify(dados)
  }

  const resposta = await fetch(`${apiUrl}${caminho}`, opcoes)
  const texto = await resposta.text()

  let conteudo = texto

  if (texto) {
    try {
      conteudo = JSON.parse(texto)
    } catch {
      // Algumas respostas podem conter texto em vez de JSON.
    }
  }

  if (!resposta.ok) {
    const mensagem =
      typeof conteudo === 'string'
        ? conteudo
        : conteudo?.detail || conteudo?.title

    throw new Error(mensagem || `Erro na operação: HTTP ${resposta.status}`)
  }

  return texto ? conteudo : null
}

export function consultarApi(caminho) {
  return executarRequisicao(caminho)
}

export function criarRequisicao(dados) {
  return executarRequisicao('/requisicoes', 'POST', dados)
}

export function atenderRequisicao(id, itens) {
  return executarRequisicao(`/requisicoes/${id}/atender`, 'POST', { itens })
}

export function cadastrarMaterial(dados) {
  return executarRequisicao('/materiais', 'POST', dados)
}

export function atualizarMaterial(id, dados) {
  return executarRequisicao(`/materiais/${id}`, 'PUT', dados)
}

export function excluirMaterial(id) {
  return executarRequisicao(`/materiais/${id}`, 'DELETE')
}

export function cadastrarColaborador(dados) {
  return executarRequisicao('/usuarios', 'POST', dados)
}