import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import api from '../services/api'
import FinalizeSale from './FinalizeSale'
import './sale.css'



export default function Sale() {

  const [clientOptions, setClientOptions] = useState([])
  const [productOptions, setProductOptions] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)
  const [currentClient, setCurrentClient] = useState(null)

  const [msg, setMsg] = useState([false, ""]) 
  const [disabledClient, setDisabledClient] = useState(false)

  const [selectedProducts, setSelectedProducts] = useState([])
  const [nextScreen, setNextScreen] = useState(false)

  const [subTotal, setSubTotal] = useState(0)
  const [discount, setDiscount] = useState(0)


  useEffect(() => {
    getClients()
    getProducts()
  }, [])

  useEffect(() => {
    updateSubTotal()

  }, [selectedProducts])

  useEffect(() => {
    if (msg[1].length != 0) {
      setTimeout(() => {
        setMsg([false, ""])
      }, 4000);
    }
  }, [msg])

  async function getClients() {
    var { data } = await api.post('/get-clients')
    if (!data.status) return alert("Erro interno grave, entre em contato com o administrador do site.")
      
    console.log("[backend] Clientes recebidos: ", data.clients)


    var clientsINFO = []
    for (var i = 0; i < data.clients.length; i++) {
      clientsINFO.push({ clientID: data.clients[i].id, label: data.clients[i].nome, value: data.clients[i].id })
      
    }

    setClientOptions([...clientsINFO])
  }
  async function getProducts() {
    var { data } = await api.post("/get-products")
    if (!data.status) return alert("Erro interno grave, entre em contato com o administrador do site.")

    console.log("[backend] Produtos recebidos: ", data.products)
    
    var productsINFO = []
    var outOfStock = {
      label: "Produtos sem estoque",
      options: []
    }

    for (var i = 0; i < data.products.length; i++) {
      var product = data.products[i]

      if (product.qtd_disponivel === 0)
        outOfStock.options.push({ value: product.id, label: product.nome, productID: product.id, available: product.qtd_disponivel, disabled: true })
      else
      productsINFO.push({ 
        productID: product.id,
        label: product.nome, 
        available: product.qtd_disponivel, 
        value: product.id,
        price: product.revenda 
      })
    }



    setProductOptions([...productsINFO, { ...outOfStock }])
  }

  function updateSubTotal() {
    var subtotal = 0
    for (var i = 0; i < selectedProducts.length; i++) {
      subtotal += Number(selectedProducts[i].price)*Number(selectedProducts[i].amount)
    }
    setSubTotal(subtotal)
  }
  function handleProductSelect(options) {
    setCurrentProduct(options)
    console.log("Produto atual: ", options)
  }
  function handleClientSelect(options) {
    setCurrentClient(options)

    console.log("Cliente atual: ", options)
  }

  function validateInput(element) {
    if (currentProduct) {
      const limiteValue = currentProduct.available
      var value = String(element.value)
  
      if (value > limiteValue) {
        element.value = value.slice(0, value.length-1)
      } else {
        for (var i = 0; i < value.length; i++) {
          var p = value[i]
          if (p != "1" && p != "2" && p != "3" && p != "4" && p != "5" && p != "6" && p != "7" && p != "8" && p != "9" && p != "0")
            element.value = value.slice(0, value.length-1)
        }
      }

    } else element.value = 1
  }
  function validateInputDiscount(element) {
    const limiteValue = subTotal
    var value = String(element.value)

    if (Number(value) > limiteValue) {
      value = value.slice(0, value.length-1)
    } else {
      for (var i = 0; i < value.length; i++) {
        var p = value[i]
        if (p != "1" && p != "2" && p != "3" && p != "4" && p != "5" && p != "6" && p != "7" && p != "8" && p != "9" && p != "0" && p != ".")
          value = value.slice(0, value.length-1)
      }
    }
    element.value = value
    setDiscount(Number(value).toFixed(2))
  }

  function addProduct() {
    if (currentProduct) {
      var amount = document.querySelector("#amount").value

      if (!currentClient) {
        setMsg([false, "Nenhum cliente selecionado"])
      } else if (amount > currentProduct.available || amount <= 0) {
        setMsg([false, "Quantidade de produtos inválido"])
      } else {
        console.log("Atual: ", currentProduct, currentClient)
        setSelectedProducts([...selectedProducts, { 
          product: currentProduct.label,
          amount: amount,
          price: currentProduct.price,
          id: currentProduct.productID,
          clientID: currentClient.clientID,
        }])

        var newAvailableAmount = []

        for (var i = 0; i < productOptions.length; i++) {
          var loopPos = {...productOptions[i]}

          if (loopPos.productID === currentProduct.productID)
            loopPos.available = Number(currentProduct.available) - Number(amount)
          
          newAvailableAmount.push({ ...loopPos })
        }

        setProductOptions([ ...newAvailableAmount ])   
        
        // Clear options selected
        if (!disabledClient) setDisabledClient(true)

        document.querySelector("#amount").value = "1"
        setCurrentProduct(null)

        setMsg([1, "Produto selecionado com sucesso"])

      }
    } else {
      setMsg([false, "Nenhum produto selecionado"])
    }
  }

  function finishSale() {
    if (selectedProducts.length > 0) {
      setNextScreen(true)
    } else 
      setMsg([false, "Selecione algum produto para poder finalizar a venda."])
  }

  function deleteCard(element) {
    if (element) {
      var id = element.value

      var newSelectedValues = selectedProducts

      for (var i = 0; i < newSelectedValues.length; i++)
        if (id == selectedProducts[i].id) {
          var updateAvailableProducts = []
          for (var a = 0; a < productOptions.length; a++) {
            var product = productOptions[a]
            if (product.productID == Number(id)) {
              product.available += Number(selectedProducts[i].amount)
            }
            updateAvailableProducts.push(product)
          }

          newSelectedValues.splice(i, 1)
          setSelectedProducts([...newSelectedValues])
          break
        }
    }  
  }

  // Estrutura para as opções do select
  const format = (product) =>
    <div className="select-option-amount">
      <div>{product.label}</div>
      <div className="select-amount-option">{product.available}</div>
    </div>
  

  return (
    nextScreen 
    ? <FinalizeSale allPurchases={selectedProducts} totalPrice={subTotal} discount={discount} state={setNextScreen} />
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
                  <Select 
                    placeholder="Selecione um cliente"
                    options={clientOptions} 
                    onChange={(element) => handleClientSelect(element)} 
                    value={currentClient}
                    isDisabled={disabledClient}
                  />
                </div>
              </div>

              <div className="input-container-1">
                <div className="container-sale product-select">
                  <div className="one-form-input m-0">
                    <label>Selecione um Produto</label>
                    <Select 
                      placeholder="Selecione um produto"
                      options={productOptions} 
                      onChange={(element) => handleProductSelect(element)}
                      value={currentProduct}
                      isOptionDisabled={(option) => option.disabled}
                      formatOptionLabel={format}

                    />
                  </div>
                </div>

                <div className="container-sale quant-input">
                  <label>Qtd.</label>
                  <input 
                    type="number"
                    min="1"
                    id="amount"
                    defaultValue="1"
                    disabled = {currentProduct != null ? false : true}
                    onChange={(element) => validateInput(element.target)}
                    onFocus={(element) => element.target.select()}
                    onBlur={(element) => element.target.value.length <= 0 ? element.target.value = 1 : ""}
                  />
                  <small><strong>MAX: { currentProduct ? currentProduct.available : 0 }</strong></small>
                </div>  
              </div>
            </div>

            <div className="input-container">

              <div className="text-end">
                <button className="btn-blue" id="send-sell" onClick={() => addProduct()}>Adicionar</button>
              </div>

                {
                  msg[1] 
                  ? msg[0] 
                    ? <div className="success-msg msg-alerts text-center">{msg[1]}</div>
                    : <div className="error-msg msg-alerts">{msg[1]}</div>
                  : <></>
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
                  selectedProducts.map(item =>
                    <div className="product-sell">
                      <div className="card-sale-produto">{item.product}</div>
                      <div className="card-sale-qtd">x{item.amount}</div>
                      <div className="card-sale-valor">R${item.price}</div>
                      <div className="card-sale-valor-final">R${(item.price*item.amount).toFixed(2)}</div>

                      <div className="delete-card" onClick={(element) => deleteCard(element.target.children[1])}>
                        <i class="fas fa-trash-alt" onClick={() => deleteCard(document.querySelector(`#S${item.id}`))}></i>
                        <input type="hidden" id={`S${item.id}`} value={item.id} />
                      </div>
                    </div>
                  )
                }

                <div style={{borderTop: 'solid 1px rgba(128, 128, 128, 0.542)'}}></div>
              </div>

            </div>
            <div className="text-end subtotal-small container-sale">
              <div className="text-start">
                <label htmlFor="discount" className="label-default" >Desconto (R$)</label>
                <input 
                  type="string" 
                  className="input-default" 
                  id="discount" 
                  defaultValue="0"
                  placeholder={"Digite um desconto (R$)"}
                  onFocus={(element) => element.target.select()}
                  onBlur={(element) => element.target.value.length <= 0 ? element.target.value = 0 : ""}
                  onChange={(element) => validateInputDiscount(element.target)}
                />
              </div>
              <div>
                <strong>Subtotal: </strong>
                R$ { (subTotal - discount).toFixed(2) }
              </div>
            </div>
            <div className="text-end">
              <button className="btn-green" id="finally-add" onClick={() => finishSale()}>Finalizar Venda</button>
            </div>          
          </div>
        </div>
      </div>
    </div>

  )
}
