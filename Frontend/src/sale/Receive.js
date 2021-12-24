import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import api from '../services/api'



export default function Receive() {
  const [clientOptions, setClientOptions] = useState([])
  const [currentClient, setCurrentClient] = useState()
  const [clientHistory, setClientHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState([false, ""])


  useEffect(() => {
    getClients()
  }, [])

  async function getClients() {
    var { data } = await api.post("/get-clients-debt")
    if (!data.status) return alert("Erro ao buscar clientes!")

    var optionsClient = []
    for (var i = 0; i < data.clients.length; i++) {
      var currentPos = data.clients[i]
      optionsClient.push({ value: currentPos.id_cliente, label: currentPos.nome, debt: currentPos.pendencia_final })
    }
    setClientOptions([ ...optionsClient ])

    console.log("[backend] clientes: ", data)
  } 

  async function updateHistory(id) {
    setLoading(true)
    var {data} = await api.post("/get-sale-history", { clientID: id })
    setLoading(false)
    if (!data.status) return alert("Erro ao consultar histórico do cliente")

    setClientHistory([...data.history])
  }

  function handleChangeSelect(element) {
    updateHistory(element.value)
    setCurrentClient(element)
  }

  function handleInputChange(element) {
    var value = element.value

    if (Number(value) > Number(currentClient.debt) || value.split('.').length-1 > 1)
      element.value = value.slice(0, value.length-1)

    for (var i = 0; i < value.length; i++) {
      var p = value[i]
      if (p != "1" && p != "2" && p != "3" && p != "4" && p != "5" && p != "6" && p != "7" && p != "8" && p != "9" && p != "0" && p != ".")
        element.value = value.slice(0, value.length-1)
    }
  }

  function finishReceive() {
    var input = document.querySelector("#receive-input")
    if (input.value <= 0) {
      setMsg([false, "Insira um valor válido"])
    }
  }



  const formatOption = (client) => 
  <div className="client-debt-select">
    <div>{client.label}</div>
    <div className={`client-debt-value`}>R$ {client.debt}
      <div className={`circle-debt 
        ${
          client.debt < 150 
            ? "debt-green" : 
          client.debt >= 150 && client.debt < 250 
            ? "debt-yellow" :
          client.debt >= 250 ? "debt-red" : 
            ""
        }
      `}></div>
    </div>
  </div>


  return (
    <div className="w-100">
      <div className="container mt-5">
        <div className="small-title mb-4">Receber pagamento</div>
        <Select 
          options={clientOptions}
          placeholder="Selecione um cliente"
          formatOptionLabel={formatOption}
          onChange={(value) => handleChangeSelect(value)}
        />
      </div>

      {
        currentClient 
        ?
          <div className="mt-2 container receive-dinamic-client">
            <div className="handle-container-receive">
              <div className="receive-total-title">
                <span>Valor total da dívida: </span>
                <span style={{ fontWeight: 700 }}>R$ {currentClient.debt}</span>
              </div>

              <label>Valor Recebido (R$)</label>
              <input 
                type="text"
                className="input-default" 
                placeholder="Digite uma quantia" 
                onChange={(element) => handleInputChange(element.target)}
                onFocus={(element) => element.target.select()}
                onBlur={(element) => element.target.value.length <= 0 ? element.target.value = 0 : ""}
                defaultValue="0"
                id="receive-input"
              />

              <div className="btns-receive-container text-end">
                <button className="finalize-btn-cancel">Cancelar</button>
                <button className="finalize-btn-success" onClick={() => finishReceive()}>Adicionar pagamento</button>
              </div>

              {
                msg[1].length > 0 ?
                msg[0] 
                  ? <div className="success-msg msg-alerts text-center">teste ola error</div>
                  : <div className="error-msg msg-alerts text-center">teste ola error</div>
                : <></>
              }

              
            </div>

            <div className="card-client-history-receive">
              <div className="title-action-receive">Histórico do Cliente</div>
              {
                clientHistory.map(item => 
                <div className="option-action-receive">
                  <span style={{width: '25%'}}>{item.createdat.split("-").reverse().join("-")}</span>
                  <span style={{width: '6%'}}><i class="fas fa-arrow-right"></i></span>
                  <span style={{width: '69%'}}>
                    {item.valor_pendente != 0 
                      ? <span> Fez uma dívida <span style={{color: 'red'}}> - R$${item.valor_pendente}</span></span> 
                      : <span> Pagou <span style={{color: 'green'}}> + R${item.valor_recebido}</span></span>}
                  </span>
                </div>)
              }
              {
                loading 
                ? <div className="text-center"><img src={`${require('../images/loading.gif').default}`}/></div>
                : <></>
              }
            </div>
          </div>
        : ""
      }
      
    </div>
  )
}
