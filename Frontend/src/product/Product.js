import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './product.css'



export default function Client() {

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState([])

  var formState = {
    name: "",
    marca: "",
    custo: "",
    revenda: "",
  }

  function changeForm(state) {
    var id = state.id
    var value = state.value

    formState[id] = value
  }

  async function submitClient() {
    if (loading == false) {
      var errorMsg = ""
      
      if (formState['name'].length < 2)
        errorMsg = "Por favor, preencha com o nome do produto!"
      else if (formState['marca'].length === 0)
        errorMsg = "Por favor, adicione a marca do produto"
      else if (formState['custo'] <= 0)
        errorMsg = "Por favor, insira um cuso válido.!"
      else if (formState['revenda'] <= 0)
        errorMsg = "Por favor, insira um valor de revenda válido.!"
      
      setMsg([false, errorMsg])
      
      if (errorMsg.length <= 0) {

        document.querySelector(".btn-blue").setAttribute("disabled", "disabled")
        setLoading(true)
        
        var response = await api.post("/create-product", {formState: formState}) 
          
        setLoading(false)
        document.querySelector(".btn-blue").removeAttribute("disabled")

        if (!response.status) return alert("Erro ao cadastrar cliente.")

        setMsg([true, "Produto cadastrado com sucesso"])
        clearPage()
      } 


      setTimeout(() => {
        setMsg([false, ""])
      }, 4000);
    }
  }

  function clearPage() {
    var keys = Object.keys(formState)

    for (var c = 0; c < keys.length; c++) {
      var currentInput = document.querySelector(`#${keys[c]}`)

      currentInput.value = "" 
    }

    formState = {
      name: "",
      marca: "",
      custo: "",
      revenda: "",
    }
  }

  return (
    <div className="w-100">

      <div className="container-form container mt-5 ">
        <div className="small-title text-center p-0">Cadastro de Produto</div>

        <div className="one-form-input">
          <label htmlFor="name">Nome do produto</label>
          <input className="input-default" type="text" id="name" placeholder="Digite o nome do produto" 
            onChange={(event) => changeForm(event.target)}
          />
        </div>

        <div className="one-form-input">
          <label htmlFor="marca">Marca do produto</label>
          <input className="input-default" type="text" id="marca" placeholder="Digite o nome da marca do produto" 
            onChange={(event) => changeForm(event.target)}
          />
        </div>

        <div className="container-product-form mt-1">
          <div className="one-form-input">
            <label htmlFor="custo">Custo do Produto (R$)</label>
            <input pattern={"^d+(.|,)d{2}$"} className="input-default" type="number" id="custo" placeholder="Digite o preço de custo do produto" 
              onChange={(event) => changeForm(event.target)}
            />
          </div>

          <div className="one-form-input">
            <label htmlFor="revenda">Preço de Revenda (R$)</label>
            <input className="input-default" type="number" id="revenda" placeholder="Digite o preço de revenda do produto"
              onChange={(event) => changeForm(event.target)}
              pattern={"^d+(.|,)d{2}$"}
            />
          </div>
        </div>
        
        {
          msg[0] 
          ? <div className="success-msg mt-2 text-center">{msg}</div> 
          : <div className="error-msg mt-2">{msg}</div>
        }
        

        <div className="text-center">
          {
            loading ? <img src={`${require('../images/loading.gif').default}`} /> : ''
          }
        </div>

        <div className="text-right mt-4">
          <Link to="/dashboard">
            <button className="btn-red mr-2">Cancelar</button>            
          </Link>
          <button className="btn-blue" onClick={() => submitClient()} >Cadastrar</button>
        </div>


      </div>

    

    </div>
  )
}
