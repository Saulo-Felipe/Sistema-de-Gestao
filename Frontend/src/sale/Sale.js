import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Select from 'react-select'
import './sale.css'
import { v4 as uuid } from "uuid";
import FinalizeSale from './FinalizeSale'

export default function Sale() {
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [allCards, setAllCards] = useState([])
  const [oneCard, setOneCard] = useState({
    id: "",
    client: "",
    client_id: "",
    product: "",
    product_id: "",
    amount: "1",
    price: "0"
  })
  const [valueOfclient, setValueOfclient] = useState(null)
  const [valueOfProduct, setValueOfProduct] = useState(null)
  const [msg, setMsg] = useState([false, ""])
  const [subtotal, setSubtotal] = useState(0)
  const [finalizeSale, setFinalizeSale] = useState(false)
  
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

    const id = uuid()
    setOneCard({...oneCard, amount: "1", id: id})
  }

  useEffect(() => {
    refreshState()
  }, [])

  function addCard() {
    if (valueOfProduct === null)
      setMsg([false, "Selecione um produto para poder vendê-lo."])
    else if (valueOfclient === null)
      setMsg([false, "Selecione o cliente comprador."])
    else if (document.querySelector("#amount").value < "1")
      setMsg([false, "Digite uma quantidade maior que 0."])
    else {
      updateSubtotal("sale", oneCard.price, oneCard.amount)
      setAllCards([...allCards, oneCard])

      refreshState()
      clearPage()
      setMsg([true, "Venda adicionada com sucesso!"])
    }
    
    setTimeout(() => {
      setMsg([false, ""])
    }, 4000);
  }
  
  function clientSelectChange(element) {
    if (element) {
      setValueOfclient(element)
      var fakeCard = oneCard

      fakeCard['client'] = element.label
      fakeCard['client_id'] = element.value
  
      setOneCard(fakeCard)
    } 
  }

  function productSelectChange(element) {
    if (element) {
      setValueOfProduct(element)
      var fakeCard = oneCard

      fakeCard['product'] = element.label
      fakeCard['product_id'] = element.value
      fakeCard['price'] = element.price
  
      setOneCard(fakeCard)
    }
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

    setValueOfProduct(null)

    document.getElementById("amount").value = "1"
  }

  function deleteCard(element) {

    if (element) {
      var id = element.value

      var fakeCards = allCards

      for (var i = 0; i < fakeCards.length; i++)
        if (id == allCards[i].id) {  
          updateSubtotal("delete", fakeCards[i].price, fakeCards[i].amount)
          fakeCards.splice(i, 1)
          setAllCards([...fakeCards])
          break
        }
    }  
    console.log("Delete: ", element)
  }

  function updateSubtotal(type, value, amount) {
    var oldSubtotal = subtotal
    var num = 0
    if (type == "sale") {
      num = Number(oldSubtotal) + (Number(value) * Number(amount))
    } else {
      num = Number(oldSubtotal) - (Number(value) * Number(amount))      
    }
    
    setSubtotal(isFloat(num) ? num.toFixed(2) : num)
  }

  function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }
  
  return (
    finalizeSale 
    ? <FinalizeSale allPurchases={allCards} totalPrice={subtotal} />
    :
    <div className="w-100">
      <div className="grid-container">
        

        <div className="content-sale">
          <div className="container-01">

            <div>
              <div className="container-sale">
                <div className="small-title text-center sale-title">Lançamento de Vendas</div>

                <div className="one-form-input m-0">
                  <label>Selecione um Cliente</label>
                  <Select value={valueOfclient} options={clients} onChange={(element) => clientSelectChange(element)} />
                </div>
              </div>

              <div className="input-container-1">
                <div className="container-sale product-select">
                  <div className="one-form-input m-0">
                    <label>Selecione um Produto</label>
                    <Select value={valueOfProduct} options={products} onChange={(element) => productSelectChange(element)} />
                  </div>
                </div>

                <div className="container-sale quant-input">
                  <label>Qtd.</label>
                  <input type="number" min="1" id="amount" defaultValue="1" onChange={(element) => setOneCard({...oneCard, amount: element.target.value})}/>
                </div>  
              </div>
            </div>

            <div className="input-container">

              <div className="text-end">
                <button className="btn-blue" id="send-sell" onClick={() => {addCard()}}>Adicionar</button>
              </div>

              {
                msg[1].length > 0
                ? msg[0] ? <div className="success-msg msg-alerts">{msg[1]}</div> : <div className="error-msg msg-alerts">{msg[1]}</div>
                : ""
              }

            </div>
          </div>

          <div className="container-02">
            <div className="table-sale">

              <div className="table-sale-title">
                <div className="card-sale-produto">Produto</div>
                <div className="card-sale-qtd">Qtd.</div>
                <div className="card-sale-valor">Valor</div>
                <div className="card-sale-valor-final">Valor Final</div>
              </div>

              <div className="sell-container-products">

                {
                  allCards.map(item =>
                    <div className="product-sell">
                      <div className="card-sale-produto">{item.product}</div>
                      <div className="card-sale-qtd">x{item.amount}</div>
                      <div className="card-sale-valor">R${item.price}</div>
                      <div className="card-sale-valor-final">R${item.price*item.amount}</div>

                      <div className="delete-card" onClick={(element) => deleteCard(element.target.children[1])}>
                        <i class="fas fa-trash-alt"></i>
                        <input type="hidden" value={item.id} />
                      </div>
                    </div>
                  )
                }

                <div style={{borderTop: 'solid 1px rgba(128, 128, 128, 0.542)'}}></div>
              </div>
              <div className="text-end subtotal-small">
                <strong>Subtotal: </strong>
                R$ {subtotal}
              </div>
            </div>

            <div className="text-end">
              <button className="btn-green" id="finally-add" onClick={() => {
                if (allCards.length === 0) {
                  setMsg([false, "Adicione algum produto para poder finalizar a venda."])

                  setTimeout(() => setMsg([false, ""]), 4000)
                }
                else 
                  setFinalizeSale(true)
              }
              }>Finalizar Venda</button>
            </div>          
          </div>

        </div>

      </div>
    </div>
  )
}
