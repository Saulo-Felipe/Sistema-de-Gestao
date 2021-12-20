import React, { useEffect, useState } from 'react'
import api from "../services/api"


export default function FinalizeSale(props) {
  const [totalPrice, setTotalPrice] = useState(0)
  const [saleType, setSaleType] = useState(<span className="text-green">Faturado</span>)
  const [thing, setThing] = useState(0)
  const [pedingValue, setPendingValue] = useState(0)

  useEffect(() => {
    console.log("Valores recebidos: ", props)

    setTotalPrice(props.totalPrice - props.discount)

    document.querySelector("#pay-value").addEventListener("blur", (element) => {
      var elementValue = element.target.value
      if (elementValue.length == 0)
        element.target.value = 0
    })
  
    document.querySelector("#pay-value").addEventListener("focus", (element) => {
      console.log("Focus: ", element)
      element.target.select()
    })

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
    var { data } = await api.post("/create-sale", {
      allPurchases: props.allPurchases,
      totalPrice: props.totalPrice,
      pedingValue: pedingValue,
    })
  }


  return (
    <div className="w-100">
      <div className="container-sale finalize-container-sale">
        <div className="small-title text-center">Finalizar Compra</div>

        <div className="mt-5">
          <div className="finale-sale-total-mini"><strong>Valor Total:</strong> R${props.totalPrice}</div>
          <div className="finale-sale-total-mini"><strong>Desconto:</strong> - R${props.discount}</div>
          <div className="finale-sale-total">Valor Final:&emsp;R${totalPrice}</div>

          <hr className="mt-2 mb-2" />

          <label className="label-default" htmlFor="pay-value">Valor Pago (R$)</label>
          <input className="input-default" id="pay-value" type="number" defaultValue={totalPrice} onChange={(element) => handlePayValueChange(element.target)} min="0" placeholder="Valor recebido"/>
        </div>
        
        <div className="finalize-informations">
          <div>Troco: R$ {thing}</div>
          <div>Situação: {saleType}</div>
          <div>Valor Pendente: R$ {pedingValue}</div>
        </div>


        <button onClick = {() => finaleSale()} className="finalize-btn"> Finalizar venda</button>
      </div>

    </div>
  )
}
