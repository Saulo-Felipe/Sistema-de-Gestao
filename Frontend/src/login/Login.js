import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'


export default function Login() {

  const navigate = useNavigate()

  function enter() {
    var inputValue = document.querySelector("#password").value
    
    if (inputValue != "123") {
      alert("Senha incorreta!")
    } else {
      localStorage.setItem("login_token", "123")
      navigate("/dashboard")
    }
  }

  function showPassword() {
    const inputPassword = document.getElementById("password")
    
    if (inputPassword.type == "password") {
      inputPassword.type = "text"
    } else {
      inputPassword.type = "password"
    }
  }

  useEffect(() => {
    if (localStorage.getItem("login_token"))
      localStorage.removeItem("login_token")

    var isFocus = false
    document.querySelector("#password").addEventListener("focus", () => {
      isFocus = true
    })
    document.querySelector("#password").addEventListener("blur", () => {
      isFocus = false
    })
    document.addEventListener("keydown", (event) => {
      if (isFocus && event.key == "Enter") 
        enter()
    })
  }, [])
  

  return (
    <div id="login-container">
      <div className="action">
        <h1>Seja Bem vindo(a)!</h1>
        <input type="password" id="password" placeholder="Digite sua senha de acesso" />
        <div className="show-password-container">
          <input id="show-password" type="checkbox" onChange={() => showPassword()} />
          <label htmlFor="show-password">Mostrar Senha</label>
        </div>
        <button type="submit" onClick={() => enter()}>Entrar</button>
      </div>
    </div>
  )
}