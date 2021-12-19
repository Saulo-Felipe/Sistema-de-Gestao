import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './client.css'


export default function Client() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  var formState = {
    city: "Ingá",
    district: "",
    name: "",
    nascimento: "",
    phone: "",
    state: "PB",
    street: "",
  }

  function changeForm(state) {
    var id = state.id
    var value = state.value

    formState[id] = value
    
    console.log(formState)
  }


  async function submitClient() {
    const errorMsg = document.querySelector(".error-msg")

    if (formState['name'].length < 4)
      errorMsg.innerHTML = "Por favor, preencha com o nome completo do cliente!"
    else if (formState['phone'].length < 4)
      errorMsg.innerHTML = "Por favor, adicione algum número de contato do clinete!"  
    else if (formState['nascimento'].length < 2)
      errorMsg.innerHTML = "Por favor, insira a data de nascimento do cliente!"  
    
    else  {
      setLoading(true)
      
      var response = await api.post("/create-client", {formState: formState}) 

      if (!response.data.status) return alert("Erro ao cadastrar cliente.")
      
      setLoading(false)
      
      navigate("/dashboard")
    }
    
    setTimeout(() => {
      errorMsg.innerHTML = ""
    }, 4000);
  }


  return (
    <div className="w-100">

      <div className="container-form container mt-1 ">
        <div className="small-title text-center p-0">Cadastro de Cliente</div>

        <div className="one-form-input">
          <label htmlFor="name">Nome Completo</label>
          <input className="input-default" type="text" id="name" placeholder="Digite o nome completo do cliente" 
            onChange={(event) => changeForm(event.target)}
          />
        </div>

        <div className="one-form-input">
          <label htmlFor="nascimento">Nascimento</label>
          <input className="input-default" type="date" id="nascimento" 
            onChange={(event) => changeForm(event.target)}
          />
        </div>

        <div className="one-form-input">
          <label htmlFor="phone">Telefone</label>
          <input className="input-default" type="tel" id="phone" placeholder="Número para contato do cliente" 
            onChange={(event) => changeForm(event.target)}
          />
        </div>

        <div className="title-client  mt-3"><i className="fas fa-home"></i> Endereço</div>

        <div className="container-client-form gray mt-1">
          <div className="form-set-container">
            <div className="one-form-input">
              <label htmlFor="district">Bairro</label>
              <input className="input-default" type="text" id="district" placeholder="Bairro" 
                onChange={(event) => changeForm(event.target)}
              />
            </div>


            <div className="one-form-input">
              <label htmlFor="street">Rua</label>
              <input className="input-default" type="text" id="street" placeholder="Rua" 
                onChange={(event) => changeForm(event.target)}
              />
            </div>

            <div className="one-form-input">
              <label htmlFor="city">Cidade</label>
              <input className="input-default" type="text" id="city" placeholder="Cidade" defaultValue="Ingá" 
                onChange={(event) => changeForm(event.target)}
              />
            </div>

            <div className="one-form-input">
              <label htmlFor="state">Estado</label>
              <input className="input-default" type="text" id="state" placeholder="Estado" defaultValue="PB"
                onChange={(event) => changeForm(event.target)}
              />
            </div>
          </div>
        </div>

        <div className="error-msg mt-2"></div>

        <div className="text-center">
          {
            loading ? <img src={`${require('../images/loading.gif').default}`} /> : ''
          }
        </div>
        

        <div className="text-right mt-4">
          <Link to="/dashboard">
            <button className="btn-red mr-2">Cancelar</button>            
          </Link>
          <button className="btn-blue" onClick={() => submitClient()}>Cadastrar</button>
        </div>
        
      </div>
    </div>
  )
}
