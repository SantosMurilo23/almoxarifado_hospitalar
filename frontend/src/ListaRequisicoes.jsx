import { useEffect, useState } from 'react'
import { atenderRequisicao, consultarApi } from './api.js'

export default function ListaRequisicoes({  versaoLista  }) {
  const [requisicoes, setRequisicoes] = useState([])
  const [avisoLista, setAvisoLista] = useState('Carregando requisições...')
  const [pedidoSelecionadoId, setPedidoSelecionadoId] = useState(null)
  const [detalhe, setDetalhe] = useState(null)
  const [erroDetalhe, setErroDetalhe] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [avisoAtendimento, setAvisoAtendimento] = useState('')

  useEffect(() => {
    let ativo = true

    consultarApi('/requisicoes')
      .then((lista) => {
        if (!ativo) return

        setRequisicoes(lista)
        setAvisoLista(lista.length === 0 ? 'Nenhuma requisição cadastrada.' : '')
      })
      .catch(() => {
        if (ativo) {
          setAvisoLista('Não foi possível carregar as requisições.')
        }
      })

    return () => {
      ativo = false
    }
  }, [versaoLista])

  useEffect(() => {
    if (pedidoSelecionadoId === null) return

    let ativo = true

    consultarApi(`/requisicoes/${pedidoSelecionadoId}`)
      .then((pedido) => {
        if (ativo) setDetalhe(pedido)
      })
      .catch(() => {
        if (ativo) setErroDetalhe('Não foi possível carregar os detalhes.')
      })

    return () => {
      ativo = false
    }
  }, [pedidoSelecionadoId])

  function selecionarPedido(id) {
    setAvisoAtendimento('')
    setErroDetalhe('')
    setDetalhe(null)
    setPedidoSelecionadoId(id)
  }

  async function confirmarAtendimento(evento) {
    evento.preventDefault()

    if (enviando || detalhe?.status !== 'Pendente') return

    const campos = new FormData(evento.currentTarget)
    const itens = detalhe.itens.map((item) => ({
      materialId: item.materialId,
      quantidadeAtendida: Number(campos.get(`atendimento-${item.materialId}`)),
    }))

    setEnviando(true)
    setAvisoAtendimento('Registrando atendimento...')

    try {
      const resultado = await atenderRequisicao(detalhe.id, itens)

      setRequisicoes((lista) =>
        lista.map((pedido) =>
          pedido.id === resultado.id
            ? { ...pedido, status: resultado.status }
            : pedido
        )
      )

      // A API confirmou a gravação. As quantidades abaixo são as que ela aceitou.
      const quantidades = new Map(
        itens.map((item) => [item.materialId, item.quantidadeAtendida])
      )

      setDetalhe({
        ...detalhe,
        status: resultado.status,
        encerradaEm: resultado.encerradaEm,
        itens: detalhe.itens.map((item) => ({
          ...item,
          quantidadeAtendida: quantidades.get(item.materialId),
        })),
      })

      setAvisoAtendimento('Atendimento registrado.')
    } catch (erro) {
      setAvisoAtendimento(erro.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section>
      <h3>Requisições cadastradas</h3>

      {avisoLista && <p role="status">{avisoLista}</p>}

      <ul>
        {requisicoes.map((pedido) => (
          <li key={pedido.id}>
            Nº {pedido.id} — {pedido.solicitante} — {pedido.setor} — {pedido.status}
            {' '}
            <button
              type="button"
              disabled={enviando}
              onClick={() =>
                selecionarPedido(pedidoSelecionadoId === pedido.id ? null : pedido.id)
              }
            >
              {pedidoSelecionadoId === pedido.id ? 'Fechar detalhes' : 'Ver detalhes'}
            </button>
          </li>
        ))}
      </ul>

      {pedidoSelecionadoId !== null && (
        <section>
          <h4>Detalhes da requisição nº {pedidoSelecionadoId}</h4>

          {erroDetalhe && <p role="alert">{erroDetalhe}</p>}

          {!detalhe && !erroDetalhe && (
            <p role="status">Carregando detalhes...</p>
          )}

          {detalhe && (
            <>
              <p>Solicitante: {detalhe.solicitante}</p>
              <p>Setor: {detalhe.setor}</p>
              <p>Status: {detalhe.status}</p>

              {detalhe.observacao && <p>Observação: {detalhe.observacao}</p>}

              <form onSubmit={confirmarAtendimento}>
                <ul>
                  {detalhe.itens.map((item) => (
                    <li key={item.id}>
                      <strong>{item.material}</strong> ({item.unidadeMedida})
                      {' — '}Solicitado: {item.quantidadeSolicitada}
                      {' · '}Atendido: {item.quantidadeAtendida}

                      {detalhe.status === 'Pendente' && (
                        <div>
                          <label htmlFor={`atendimento-${item.materialId}`}>
                            Quantidade a atender
                          </label>
                          {' '}
                          <input
                            id={`atendimento-${item.materialId}`}
                            name={`atendimento-${item.materialId}`}
                            type="number"
                            min="0"
                            max={item.quantidadeSolicitada}
                            step="1"
                            defaultValue={item.quantidadeSolicitada}
                            disabled={enviando}
                            required
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {detalhe.status === 'Pendente' && (
                  <button type="submit" disabled={enviando}>
                    {enviando ? 'Registrando...' : 'Confirmar atendimento'}
                  </button>
                )}
              </form>

              {avisoAtendimento && <p role="status">{avisoAtendimento}</p>}
            </>
          )}
        </section>
      )}
    </section>
  )
}