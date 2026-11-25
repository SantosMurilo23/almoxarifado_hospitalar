import { useEffect, useState } from 'react'
import {
  consultarApi,
  cadastrarMaterial,
  atualizarMaterial,
  excluirMaterial,
} from './api.js'

const formularioVazio = {
  nome: '',
  unidadeMedida: '',
  quantidadeEstoque: 0,
  ativo: true,
}

export default function Materiais() {
  const [materiais, setMateriais] = useState([])
  const [formulario, setFormulario] = useState(formularioVazio)
  const [editandoId, setEditandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    consultarApi('/materiais')
      .then((dados) => {
        if (ativo) setMateriais(dados)
      })
      .catch((falha) => {
        if (ativo) setErro(falha.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  function alterarCampo(evento) {
    const { name, value, type, checked } = evento.target

    setFormulario((atual) => ({
      ...atual,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function limparFormulario() {
    setFormulario({ ...formularioVazio })
    setEditandoId(null)
  }

  function editar(material) {
    setFormulario({
      nome: material.nome,
      unidadeMedida: material.unidadeMedida,
      quantidadeEstoque: material.quantidadeEstoque,
      ativo: material.ativo,
    })
    setEditandoId(material.id)
    setMensagem('')
    setErro('')
  }

  async function salvar(evento) {
    evento.preventDefault()
    if (salvando) return

    const quantidade = Number(formulario.quantidadeEstoque)

    if (
      !formulario.nome.trim() ||
      !formulario.unidadeMedida.trim() ||
      formulario.quantidadeEstoque === '' ||
      !Number.isInteger(quantidade) ||
      quantidade < 0
    ) {
      setErro('Preencha nome, unidade e um estoque inteiro não negativo.')
      return
    }

    const dados = {
      nome: formulario.nome.trim(),
      unidadeMedida: formulario.unidadeMedida.trim(),
      quantidadeEstoque: quantidade,
      ativo: formulario.ativo,
    }

    setSalvando(true)
    setErro('')
    setMensagem('')

    try {
      const material = editandoId === null
        ? await cadastrarMaterial(dados)
        : await atualizarMaterial(editandoId, dados)

      setMateriais((lista) => editandoId === null
        ? [...lista, material]
        : lista.map((item) => item.id === editandoId ? material : item)
      )

      setMensagem(
        editandoId === null
          ? 'Material cadastrado.'
          : 'Material atualizado.'
      )
      limparFormulario()
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setSalvando(false)
    }
  }

  async function remover(material) {
    if (salvando) return

    const confirmou = window.confirm(
      `Deseja excluir o material "${material.nome}"?`
    )

    if (!confirmou) return

    setSalvando(true)
    setErro('')
    setMensagem('')

    try {
      await excluirMaterial(material.id)
      setMateriais((lista) => lista.filter((item) => item.id !== material.id))

      if (editandoId === material.id) limparFormulario()

      setMensagem('Material excluído.')
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="area-materiais">
      <h2>Materiais</h2>

      {erro && <p role="alert">{erro}</p>}
      {mensagem && <p role="status">{mensagem}</p>}

      <h3>{editandoId === null ? 'Cadastrar material' : 'Editar material'}</h3>

      <form onSubmit={salvar}>
        <fieldset disabled={salvando}>
          <legend>Dados do material</legend>

          <label htmlFor="material-nome">Nome</label>
          <input
            id="material-nome"
            name="nome"
            value={formulario.nome}
            onChange={alterarCampo}
            required
          />

          <label htmlFor="material-unidade">Unidade de medida</label>
          <input
            id="material-unidade"
            name="unidadeMedida"
            placeholder="Ex.: Unidade, Pacote ou Resma"
            value={formulario.unidadeMedida}
            onChange={alterarCampo}
            required
          />

          <label htmlFor="material-estoque">Quantidade em estoque</label>
          <input
            id="material-estoque"
            name="quantidadeEstoque"
            type="number"
            min="0"
            step="1"
            value={formulario.quantidadeEstoque}
            onChange={alterarCampo}
            required
          />

          <label htmlFor="material-ativo">
            <input
              id="material-ativo"
              name="ativo"
              type="checkbox"
              checked={formulario.ativo}
              onChange={alterarCampo}
            />
            Material ativo
          </label>

          <button type="submit">
            {salvando ? 'Salvando...' : 'Salvar material'}
          </button>

          {editandoId !== null && (
            <button type="button" onClick={limparFormulario}>
              Cancelar edição
            </button>
          )}
        </fieldset>
      </form>

      <h3>Materiais cadastrados</h3>

      {carregando ? (
        <p role="status">Carregando materiais...</p>
      ) : materiais.length === 0 ? (
        <p>Nenhum material disponível na lista.</p>
      ) : (
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Unidade</th>
                <th scope="col">Estoque</th>
                <th scope="col">Situação</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {materiais.map((material) => (
                <tr key={material.id}>
                  <td>{material.nome}</td>
                  <td>{material.unidadeMedida}</td>
                  <td>{material.quantidadeEstoque}</td>
                  <td>{material.ativo ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    <button
                      type="button"
                      disabled={salvando}
                      onClick={() => editar(material)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={salvando}
                      onClick={() => remover(material)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}