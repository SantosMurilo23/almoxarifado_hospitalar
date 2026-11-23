import { useEffect, useState } from 'react'
import { consultarApi, criarRequisicao } from './api.js'

export default function NovaRequisicao({  aoCriar  }) {
    const [colaboradores, setColaboradores] = useState([])
    const [solicitanteId, setSolicitanteId] = useState('')
    const [materiais, setMateriais] = useState([])
    const [materialId, setMaterialId] = useState('')
    const [quantidade, setQuantidade] = useState('1')
    const [itens, setItens] = useState([])
    const [avisoItem, setAvisoItem] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [avisoEnvio, setAvisoEnvio] = useState('')
    const [avisoMateriais, setAvisoMateriais] = useState('Carregando materiais...')
    const [aviso, setAviso] = useState('Carregando colaboradores...')

    useEffect(() => {
    let ativo = true

    consultarApi('/colaboradores')
        .then((lista) => {
        if (ativo) {
            setColaboradores(lista)
            setAviso(lista.length === 0 ? 'Nenhum colaborador disponível.' : '')
        }
        })
        .catch(() => {
        if (ativo) setAviso('Não foi possível carregar os colaboradores.')
        })

        consultarApi('/materiais')
        .then((lista) => {
            if (!ativo) return

            const materiaisAtivos = lista.filter((material) => material.ativo)
            setMateriais(materiaisAtivos)
            setAvisoMateriais(materiaisAtivos.length === 0 ? 'Nenhum material ativo.' : '')
        })
        .catch(() => {
            if (ativo) setAvisoMateriais('Não foi possível carregar os materiais.')
        })
    return () => { ativo = false }
    }, [])
    
    function adicionarItem() {
        const material = materiais.find((m) => m.id === Number(materialId))
        const quantidadeSolicitada = Number(quantidade)

        if (!material || !Number.isInteger(quantidadeSolicitada) || quantidadeSolicitada < 1) {
            setAvisoItem('Escolha um material e informe uma quantidade inteira maior que zero.')
            return
        }

        if (itens.some((item) => item.materialId === material.id)) {
            setAvisoItem('Esse material já está na lista.')
            return
        }

        setItens((lista) => [...lista, {
            materialId: material.id,
            nome: material.nome,
            unidadeMedida: material.unidadeMedida,
            quantidade: quantidadeSolicitada,
        }])
        setAvisoItem('')
    }

    async function enviarRequisicao() {
        if (enviando) return

        if (!solicitanteId || itens.length === 0) {
            setAvisoEnvio('Selecione o solicitante e adicione pelo menos um item.')
            return
        }

        setEnviando(true)
        setAvisoEnvio('Enviando...')

        try {
            const pedido = await criarRequisicao({
            solicitanteId: Number(solicitanteId),
            itens: itens.map((item) => ({
                materialId: item.materialId,
                quantidade: item.quantidade,
            })),
            })

            setAvisoEnvio(`Requisição nº ${pedido.id} criada.`)
            aoCriar()
            setItens([])
            setMaterialId('')
            setQuantidade('1')
            setSolicitanteId('')
            setAvisoItem('')
        } catch (erro) {
            setAvisoEnvio(erro.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
    <>
      <h3>Nova requisição</h3>
      <label htmlFor="solicitante">Solicitante</label>
      <select id="solicitante" name="solicitanteId" value={solicitanteId} onChange={(evento) => setSolicitanteId(evento.target.value)}>
        <option value="" disabled>Selecione um colaborador</option>
        {colaboradores.map((colaborador) => (
            <option key={colaborador.id} value={colaborador.id}>
                {colaborador.nome}
            </option>
            ))}
      </select>
      {aviso && <p role="status">{aviso}</p>}

      <label htmlFor="material">Material</label>
        <select id="material" name="materialId" value={materialId} onChange={(evento) => setMaterialId(evento.target.value)}>
        <option value="" disabled>Selecione um material</option>
        {materiais.map((material) => (
            <option key={material.id} value={material.id}>
            {material.nome} ({material.unidadeMedida})
            </option>
        ))}
        </select>
        {avisoMateriais && <p role="status">{avisoMateriais}</p>}

        <label htmlFor="quantidade">Quantidade solicitada</label>
            <input
            id="quantidade"
            type="number"
            min="1"
            step="1"
            required
            value={quantidade}
            onChange={(evento) => setQuantidade(evento.target.value)}
            />

        <button type="button" onClick={adicionarItem}>Adicionar item</button>
        {avisoItem && <p role="status">{avisoItem}</p>}

        <ul>
        {itens.map((item) => (
            <li key={item.materialId}>
            {item.nome} — {item.quantidade} ({item.unidadeMedida})
            <button
                type="button"
                onClick={() => {
                    setItens((lista) => lista.filter((i) => i.materialId !== item.materialId))
                    setAvisoItem('')
                }}
            >
                Remover
            </button>
            </li>
        ))}
        </ul>

        <button type="button" onClick={enviarRequisicao} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar requisição'}
        </button>
        {avisoEnvio && <p role="status">{avisoEnvio}</p>}
    </>
  )
}