import { useEffect, useState } from 'react'
import { consultarApi, cadastrarColaborador } from './api.js'

const formularioVazio = {
  nome: '',
  email: '',
  senha: '',
  setorId: '',
}

export default function Colaboradores() {
  const [formulario, setFormulario] = useState(formularioVazio)
  const [setores, setSetores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    let ativo = true

    consultarApi('/setores')
      .then((dados) => {
        if (ativo) setSetores(dados)
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
    const { name, value } = evento.target

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }))
  }

  async function salvar(evento) {
    evento.preventDefault()
    if (salvando) return

    setErro('')
    setMensagem('')

    if (
      !formulario.nome.trim() ||
      !formulario.email.trim() ||
      formulario.senha.trim().length === 0 ||
      formulario.senha.length < 8 ||
      !formulario.setorId
    ) {
      setErro('Preencha os dados, selecione o setor e use uma senha com pelo menos 8 caracteres.')
      return
    }

    setSalvando(true)

    try {
      const usuario = await cadastrarColaborador({
        nome: formulario.nome.trim(),
        email: formulario.email.trim(),
        senha: formulario.senha,
        setorId: Number(formulario.setorId),
      })

      setMensagem(`Colaborador ${usuario.nome} cadastrado com sucesso.`)
      setFormulario({ ...formularioVazio })
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="area-colaboradores">
      <h2>Colaboradores</h2>
      <p>Cadastre o colaborador e selecione seu setor de trabalho.</p>

      {erro && <p role="alert">{erro}</p>}
      {mensagem && <p role="status">{mensagem}</p>}

      {carregando ? (
        <p role="status">Carregando setores...</p>
      ) : setores.length === 0 ? (
        <p>Não há setores disponíveis para o cadastro.</p>
      ) : (
        <form onSubmit={salvar}>
          <fieldset disabled={salvando}>
            <legend>Dados do colaborador</legend>

            <label htmlFor="colaborador-nome">Nome completo</label>
            <input
              id="colaborador-nome"
              name="nome"
              autoComplete="name"
              value={formulario.nome}
              onChange={alterarCampo}
              required
            />

            <label htmlFor="colaborador-email">E-mail</label>
            <input
              id="colaborador-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formulario.email}
              onChange={alterarCampo}
              required
            />

            <label htmlFor="colaborador-senha">Senha</label>
            <input
              id="colaborador-senha"
              name="senha"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={formulario.senha}
              onChange={alterarCampo}
              required
            />

            <label htmlFor="colaborador-setor">Setor</label>
            <select
              id="colaborador-setor"
              name="setorId"
              value={formulario.setorId}
              onChange={alterarCampo}
              required
            >
              <option value="">Selecione um setor</option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome}
                </option>
              ))}
            </select>

            <button type="submit">
              {salvando ? 'Cadastrando...' : 'Cadastrar colaborador'}
            </button>
          </fieldset>
        </form>
      )}
    </section>
  )
}