import React from 'react'
import './styles/index.css'

import Raca from './components/Raca'
import ListaRacas from './components/ListaRacas'
import Cabecalho from './components/Cabecalho'

import { buscaSobreRacas, buscaImagemPorRaca, buscaTodasRacas } from './api'


const App = () => {
  const [racas, setRacas] = React.useState([]);
  const [racaSelecionada, setRacaSelecionada] = React.useState({});
  const [status, setStatus] = React.useState('Você ainda não selecionou nenhum cachorro :(')

  React.useEffect(() => {
    carregaInformacoesIniciais()
  });

  const carregaInformacoesIniciais = () => {
    buscaSobreRacas()
      .then(informacoes => {
        carregaListaRacas(informacoes)
      })
      .catch(erro => setStatus( 'Oops, algo deu errado no carregamento da página. Pode tentar novamente?'))
    }

    const carregaListaRacas = (sobreRacas) => {
      buscaTodasRacas()
        .then(racas => {
          const listaRacasMostradas = sobreRacas.filter(
            sobre => racas.includes(sobre.name.toLowerCase())
          )
          setRacas( [...listaRacasMostradas] )
        })
    }

   const selecionaRaca = raca => {
      const infoSelecionada = racas.filter(infoRaca => infoRaca.name === raca)

      buscaImagemPorRaca(raca)
        .then(imagem => setRacaSelecionada(
          {...racaSelecionada, imagem, ...infoSelecionada[0]},
        ))
        .then(status => setStatus(
          'A imagem sempre será diferente, pode clicar quantas vezes quiser!'
        ))
        .catch(erro => {
          const eh404 = erro.response.status === 404
          const mensagem = eh404 ? 'Não encontramos essa raça :(' : 'Oops, algo deu errado. Pode tentar novamente?'

          setStatus(mensagem)
        })
  }

  return (
    <div className="container">
      <Cabecalho status={status} />
      <Raca raca={racaSelecionada} />
      <ListaRacas racas={racas} selecionaRaca={selecionaRaca} />
    </div>
  )

};

export default App
