import * as rs from 'reactstrap';

import React, { useState } from 'react';

const ENDPOINT = "https://ooh86uy8d7.execute-api.us-east-1.amazonaws.com/dev?faturamento-anual="

function App() {
  const initialState = {isLoading: false, simulacoes: []};
  const [data, setData] = useState(initialState);
  const [count, setCount] = useState(1);

  const reiniciar = () => {
    setData(initialState)
    setCount(1);
  }

  const handleSubmit = (val) => {
    if (!val) {
      return;
    }
    data.isLoading = true;
    setData(Object.assign({}, data))
    fetch(ENDPOINT + val)
      .then((resp) => resp.json().then((result) => {

        const simulacao = {
          response: result,
          count: count
        };

        setCount(count+1);

        let simulacoes = data.simulacoes || [];
        simulacoes.unshift(simulacao);

        setData({
          isLoading: false,
          simulacoes: simulacoes
        });

      }))
      .catch((err) => setData({error: "Erro ao se comunicar com API: " + err.toString()}));

  }

  let info = null;
  let content = null;

  if (data.error) {
    info = <p>{data.error}</p>;
  }

  if (data.isLoading) {
    info = <p>Carregando dados da API...</p>;
  }

  content = data.simulacoes.map(i => <Resultado simulacao={i} key={i.count}/>)

  return (
    <>
    <rs.Navbar color="dark">Calculadora Imposto Dev Remoto

    <a href="https://github.com/rpagliuca/react-calculadora-imposto-dev-remoto">Sobre</a>

    <a href="https://github.com/rpagliuca/react-calculadora-imposto-dev-remoto">Fork me on GitHub</a></rs.Navbar>

    <rs.Col md={{size:6, offset: 3}}>
      <FaturamentoForm handleSubmit={handleSubmit} handleRestart={reiniciar} info={info}/>
      {content}
    </rs.Col>
    </>
  );

}

function Resultado({simulacao}) {

  const data = simulacao;
  const response = data.response;

  return (
    <rs.Container>

          <rs.Badge color="secondary">Simulação {data.count}</rs.Badge>
          <rs.Card className="card-simulacao">
            <rs.CardBody>
              <rs.ListGroup>
                <rs.ListGroupItem>
                  <Label>Faturamento anual (R$)</Label> <Value>{response.input["faturamento-anual-em-reais"]}</Value>
                </rs.ListGroupItem>
                <rs.ListGroupItem>
                  <Label>Impostos totais (R$)</Label> <Value>{response.output["imposto-total-em-reais"]}</Value>
                </rs.ListGroupItem>
                <rs.ListGroupItem>
                  <Label>Impostos totais em percentual (%)</Label> <Value>{response.output["imposto-total-percentual"]}</Value>
                </rs.ListGroupItem>
                <rs.ListGroupItem>
                  <Label>Faturamento anual após impostos (R$)</Label> <Value>{response.output["faturamento-menos-impostos"]}</Value>
                </rs.ListGroupItem>
                <rs.ListGroupItem>
              <rs.Badge>Impostos detalhados</rs.Badge>
              <rs.ListGroup>
                <rs.ListGroupItem>
                  <Label>Imposto de renda pessoa física (R$)</Label> <Value>{response.output["impostos-detalhados"]["imposto-renda-pessoa-fisica"]}</Value>
                </rs.ListGroupItem>
                <rs.ListGroupItem>
                  <Label>Imposto Simples Nacional (R$)</Label> <Value>{response.output["impostos-detalhados"]["imposto-simples-nacional"]}</Value>
                </rs.ListGroupItem>
                <rs.ListGroupItem>
                  <Label>INSS (R$)</Label> <Value>{response.output["impostos-detalhados"]["inss"]}</Value>
                </rs.ListGroupItem>
              </rs.ListGroup>
                </rs.ListGroupItem>
              </rs.ListGroup>


            </rs.CardBody>
          </rs.Card>

    </rs.Container>
  )
}

function FaturamentoForm({handleSubmit, handleRestart, info}) {
  const [val, setVal] = useState("");
  return (
    <rs.Container>
      <rs.Badge color="secondary">Nova simulação</rs.Badge>
      <rs.Card>
        <rs.CardBody>
          <rs.Form onSubmit={(e) => {handleSubmit(val); e.preventDefault(); setVal("");}}>
            <rs.FormGroup>
              <rs.Label>Qual é o seu faturamento anual (R$)?</rs.Label>
              <rs.Input value={val} onChange={(e) => setVal(e.target.value)}/>
            </rs.FormGroup>
            <span className="message-info">{info}</span>
            <rs.Button color="light">Calcular</rs.Button>
            <rs.Button color="light" onClick={handleRestart}>Reiniciar</rs.Button>
          </rs.Form>
        </rs.CardBody>
      </rs.Card>
    </rs.Container>
  );
}

function Label(props) {
  return <span className="item-label">{props.children}</span>
}

function Value(props) {
  return <span className="item-value">{props.children.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
}

export default App;
