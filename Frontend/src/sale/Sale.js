import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Select from 'react-select'
import './sale.css'


export default function Sale() {
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [allCards, setAllCards] = useState([])
  const [oneCard, setOneCard] = useState({
    client: "",
    client_id: "",
    product: "",
    product_id: "",
    amount: "1",
    price: "0"
  })
  
  function updateState(beforeArray, stateArray) {
    var fakeOptions = []

    beforeArray.forEach((item) => {
      fakeOptions.push({ value: item.id, label: item.nome, price: item.revenda})
    })

    stateArray(fakeOptions)
  }
  
  async function refreshState() {
    console.log("limpanddo")
    var response = await api.post("/get-clients")
    var { data } = await api.post("/get-products")

    if (!response.data.status || !data.status) return alert("Erro ao cadastrar cliente.")

    updateState(response.data.clients, setClients)
    updateState(data.products, setProducts)
  }

  useEffect(() => {
    refreshState()
  }, [])

  function addCard() {
    console.log(oneCard)
    setAllCards([...allCards, oneCard])
    refreshState()
    clearPage()
  }
  
  function clientSelectChange(element) {
    var fakeCard = oneCard

    fakeCard['client'] = element.label
    fakeCard['client_id'] = element.value

    setOneCard(fakeCard)
  }

  function productSelectChange(element) {
    var fakeCard = oneCard

    fakeCard['product'] = element.label
    fakeCard['product_id'] = element.value
    fakeCard['price'] = element.price

    setOneCard(fakeCard)
  }

  function clearPage() {
    setOneCard({
      client: "",
      client_id: "",
      product: "",
      product_id: "",
      amount: "1",
      price: "0"
    })
  }
    
  return (
    <div className="grid-container">
      
      <div className="container-sale">
        <h1 className="medium-tittle text-center">Lançamento de Vendas</h1>
      </div> 

      <div className="content-sale">

        <div className="container-01">        
          <div>
            <div className="container-sale">
              <div className="one-form-input m-0">
                <label>Selecione um Cliente</label>
                <Select options={clients} onChange={(element) => clientSelectChange(element)} />
              </div>
            </div>

            <div className="input-container-1">
              <div className="container-sale product-select">
                <div className="one-form-input m-0">
                  <label>Selecione um Produto</label>
                  <Select options={products} onChange={(element) => productSelectChange(element)} />
                </div>
              </div>

              <div className="container-sale quant-input">
                <label>Qtd.</label>
                <input type="number" id="amount" defaultValue="1" onChange={(element) => oneCard['amount'] = element.target.value}/>
              </div>  
            </div>
          </div>

          <div className="input-container">

            <div className="text-end">
              <button className="btn-blue" id="send-sell" onClick={() => {addCard()}}>Adicionar</button>
            </div>

          </div>
        </div>

        <div className="container-02">
          <div className="table-sale">

            <div className="table-sale-title">
              <div className="card-sale-produto">Produto</div>
              <div className="card-sale-qtd">Qtd.</div>
              <div className="card-sale-valor">Valor</div>
            </div>

            <div className="sell-container-products">

              {
                allCards.map(item => 
                <div className="product-sell">
                  <div className="card-sale-produto">{item.product}</div>
                  <div className="card-sale-qtd">x{item.amount}</div>
                  <div className="card-sale-valor">R${item.price*item.amount}</div>
                </div>
                )
              }

              <div style={{borderTop: 'solid 1px rgba(128, 128, 128, 0.542)'}}></div>
            </div>
            
          </div>

          <div className="text-end">
            <button className="btn-green" id="finally-add">Finalizar Venda</button>
          </div>          
        </div>

      </div>

    </div>

  )
}
