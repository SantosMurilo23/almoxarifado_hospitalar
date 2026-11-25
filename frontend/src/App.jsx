import { useEffect, useState } from 'react'
import './App.css'
import Materiais from './Materiais.jsx'
import Colaboradores from './Colaboradores.jsx'
import NovaRequisicao from './NovaRequisicao.jsx'
import ListaRequisicoes from './ListaRequisicoes.jsx'

const secoes = ['#materiais', '#colaboradores', '#requisicoes']

function obterSecao() {
  const hash = window.location.hash
  return secoes.includes(hash) ? hash : '#materiais'
}

export default function App() {
  const [secao, setSecao] = useState(obterSecao)
  const [versaoLista, setVersaoLista] = useState(0)

  useEffect(() => {
    function atualizarSecao() {
      setSecao(obterSecao())
    }

    window.addEventListener('hashchange', atualizarSecao)

    return () => {
      window.removeEventListener('hashchange', atualizarSecao)
    }
  }, [])

  function atualizarLista() {
    setVersaoLista((versao) => versao + 1)
  }

  return (
    <>
      <header className="cabecalho">
        <div className="cabecalho-conteudo">
          <span className="identificacao">Gestão de materiais de consumo</span>
          <h1>Almoxarifado Hospitalar</h1>
          <p>Organize materiais, colaboradores e requisições por setor.</p>
        </div>
      </header>

      <div className="estrutura">
        <nav aria-label="Menu principal" className="menu-principal">
          <a
            href="#materiais"
            aria-current={secao === '#materiais' ? 'page' : undefined}
          >
            Materiais
          </a>
          <a
            href="#colaboradores"
            aria-current={secao === '#colaboradores' ? 'page' : undefined}
          >
            Colaboradores
          </a>
          <a
            href="#requisicoes"
            aria-current={secao === '#requisicoes' ? 'page' : undefined}
          >
            Requisições
          </a>
        </nav>

        <main id="conteudo">
          {secao === '#materiais' && <Materiais />}
          {secao === '#colaboradores' && <Colaboradores />}

          {secao === '#requisicoes' && (
            <section className="area-requisicoes">
              <h2>Requisições</h2>
              <p>Registre pedidos e acompanhe o atendimento dos materiais.</p>
              <NovaRequisicao aoCriar={atualizarLista} />
              <ListaRequisicoes versaoLista={versaoLista} />
            </section>
          )}
        </main>

        <footer className="rodape">
          Projeto acadêmico · Ciência da Computação
        </footer>
      </div>
    </>
  )
}