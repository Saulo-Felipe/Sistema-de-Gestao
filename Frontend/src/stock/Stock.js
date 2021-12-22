import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import api from '../services/api'
import './stock.css'


export default function Stock() {
  const [products, setProducts] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  const [productAmount, setProductAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectValue, setSelectValue] = useState([])
  const [msg, setMsg] = useState([false, ""])
  const [typeChange, setTypeChange] = useState(true)
  const [newValue, setNewValue] = useState(0)

  useEffect(() => {
    refreshProducts()
  }, [])

  async function refreshProducts() {
    var { data } = await api.post("/get-products")

    var fakeProducts = []
    for (var i = 0; i < data.products.length; i++) {
      var item = data.products[i]
      fakeProducts.push({ value: item.id, label: item.nome })
    }

    setProducts(fakeProducts)
  }

  async function handleSelect(element) {
    setLoading(true)
    var { data } = await api.post("/stock", { type: "GET", id: element.value })
    setLoading(false)

    setIsChanged(true)

    if (data.valueOfProduct.length !== 0)
      setProductAmount(data.valueOfProduct[0].qtd_disponivel)
    else
      setProductAmount(0)

    setSelectValue(element)
  }

  async function updateStock() {
    const element = document.querySelector("#stock-amount").value
    if (element == 0 || element.length <= 0) {
      setMsg([false, "Insira um valor válido."])
      setTimeout(() => {
        setMsg([false, ""])
      }, 4000);
    } else {
      setLoading(true)
      var { data } = await api.post("/stock", {
        type: "CREATE", 
        id: selectValue.value, 
        newValue: typeChange 
        ? Number(productAmount) + Number(newValue) 
        : Number(productAmount) - Number(newValue)
      })
      setLoading(false)

      setProducts([])
      setIsChanged(false)
      setProductAmount(0)
      setLoading(false)
      setSelectValue([])
      setMsg([true, "Estoque atualizado com sucesso."])
      setTypeChange(true)
      setNewValue(0)
      refreshProducts()

      setTimeout(() => setMsg([false, ""]), 4000);
    }
  }

  function checkboxChange(element) {
    if (element.id === "add-stock") {
      var check = document.querySelector("#remove-stock")
      if (check) check.checked = false
      setTypeChange(true)
    } else {
      var check = document.querySelector("#add-stock")
      if (check) check.checked = false
      setTypeChange(false)
    } 

    document.querySelector("#stock-amount").value = 0
    document.querySelector("#stock-amount").select()
  }

  function changedNewValue(element) {
    var value = element.value
    if (!typeChange) {
      if (value > productAmount) {
        var newValue = value.slice(0, value.length-1)
        element.value = Number(newValue)
        value = newValue
      }
    }
    for (var i = 0; i < value.length; i++) {
      var p = value[i]
      if (p != "1" && p != "2" && p != "3" && p != "4" && p != "5" && p != "6" && p != "7" && p != "8" && p != "9" && p != "0")
        element.value = value.slice(0, value.length-1)
    }

    setNewValue(value)
  }


  return (
    <div className="w-100 mt-4">
      <div className="container">
        <div className="mb-4 small-title text-center">Estoque</div>

        <label>Selecione um produto</label>
        <Select value={selectValue} options={products} onChange={(element) => handleSelect(element)} />
        {
          msg[1].length > 0 
          ? <div className={`mt-3 ${msg[0] ? "text-green" : "text-red"} text-center`}>{msg[1]}</div>
          : ""
        }

        { 
          loading 
          ? <div className="text-center">
              <img src={`${require("../images/loading.gif").default}`} />
            </div>
          : <></>
        }

        {
          isChanged
          ?
          <> 
            <div className="mt-3 stock-default-amount">
              Quantidade disponível: <strong>{productAmount}</strong>
            </div>

            <input type="radio" defaultChecked className="mt-3" id="add-stock" onChange={(element) => checkboxChange(element.target)} />
            <label htmlFor="add-stock">Adicionar</label>

            <br />
            {
              productAmount > 0 
              ? <>
                  <input type="radio" id="remove-stock" onChange={(element) => checkboxChange(element.target)}/>
                  <label htmlFor="remove-stock">Remover</label>
                </>
              : ""
   
            }

            <div className="mt-3">
              <strong>
                <label>{typeChange ? "Adicionar Estoque": "Remover Estoque"}</label>
              </strong>
              <br />
              <input 
                type="string" 
                className="input-default" 
                id="stock-amount" 
                placeholder={`Valor para ser ${typeChange ? "Adicionado" : "Removido"}`}
                onChange={ (element) => changedNewValue(element.target) }
                onFocus={(element) => element.target.select()}
                onBlur={(element) => element.target.value.length <= 0 ? element.target.value = 1 : ""}
                defaultValue={"0"}
              />
            </div>

            <div className="stock-container-btn text-end">
                <button className="btn-red" disabled={loading ? true : false}>
                  <Link to="/dashboard" className="no-href-decoration">
                    Cancelar
                  </Link>
                </button>
              <button className="btn-blue" disabled={loading ? true : false} onClick={() => updateStock()}>Alterar</button>
            </div>
          </>
          : ""
        }


      </div>
    </div>
  )
}
