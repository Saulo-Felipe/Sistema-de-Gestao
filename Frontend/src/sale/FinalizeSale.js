import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from "../services/api"


export default function FinalizeSale(props) {
  const [totalPrice, setTotalPrice] = useState(0)
  const [saleType, setSaleType] = useState(<span className="text-yellow">Pendente</span>)
  const [thing, setThing] = useState(0)
  const [pedingValue, setPendingValue] = useState(0)
  const [isFinish, setIsFinish] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log("[Props]: ", props)

    setPendingValue(props.totalPrice)
    setTotalPrice(props.totalPrice - props.discount)
  }, [])

  function handlePayValueChange(element) {
    const value = Number(element.value)
    

    if (value >= totalPrice) {
      setSaleType(<span className="text-green">Faturado</span>)

      setThing((value - totalPrice).toFixed(2))
      setPendingValue(0)

    } else if (value < totalPrice) {
      setSaleType(<span className="text-yellow">Pendente</span>)

      var num = value - totalPrice

      setPendingValue((num < 0 ? num * -1 : num).toFixed(2))
      setThing(0)
    }
  }

  async function finaleSale () {
    console.log(props)
    setLoading(true)
    var { data } = await api.post("/create-sale", {
      allPurchases: props.allPurchases,
      totalPrice: props.totalPrice,
      pedingValue: pedingValue,
      discount: props.discount,
    })

    setLoading(false)

    if (!data.status) return alert("Erro interno ao criar venda.")

    setIsFinish(true)
  }


  return (
    !isFinish 
    ? <div className="w-100">
      <div className="container-sale finalize-container-sale">
        <div className="small-title text-center">Finalizar Compra</div>

        <div className="mt-5">
          <div className="finale-sale-total-mini"><strong>Valor Total:</strong> R${props.totalPrice}</div>
          <div className="finale-sale-total-mini"><strong>Desconto:</strong> - R${props.discount}</div>
          <div className="finale-sale-total">Valor Final:&emsp;R${totalPrice}</div>

          <hr className="mt-2 mb-2" />

          <label className="label-default" htmlFor="pay-value">Valor Pago (R$)</label>
          <input 
            className="input-default" 
            id="pay-value" 
            type="number" 
            defaultValue={totalPrice} 
            onChange={(element) => handlePayValueChange(element.target)} 
            min="0" 
            placeholder="Valor recebido"
            onFocus={(element) => element.target.select()}
            onBlur={(element) => element.target.value.length <= 0 ? element.target.value = 1 : ""}
          />
        </div>
        
        <div className="finalize-informations">
          <div>Troco: R$ {thing}</div>
          <div>Situação: {saleType}</div>
          <div>Valor Pendente: R$ {pedingValue}</div>
        </div>
        
        {
          loading
          ?
          <div className="text-center mt-2">
            <img style={{position: "absolute"}} src={`${require("../images/loading.gif").default}`}/>
          </div>
          : <></>

        }

        <div className="text-end">
          <button 
            onClick={() => props.state(false)} 
            className="finalize-btn-cancel"
            disabled={loading ? true : false}
          >Voltar</button>

          <button 
            onClick = {() => finaleSale()} 
            className="finalize-btn-success" 
            disabled={loading ? true : false}
          > Finalizar venda</button>
        </div>

      </div>

    </div>

    : <div className="w-100">
      <div className="container finish-sale-last">
        <div className="success-icon"><i class="fas fa-check"></i></div>
        <div className="small-title finish-sale-title">Venda efetuada com sucesso!</div>
      </div>
      <div className="container mt-2 text-center">

        <button className="finalize-btn-success" onClick={() => window.location.reload()}>Realizar uma nova venda</button>

        <Link to="/dashboard">
          <button className="finalize-btn-blue">Página inicial <i class="fas fa-home"></i></button>
        </Link>
      </div>
    </div>
  )
}
