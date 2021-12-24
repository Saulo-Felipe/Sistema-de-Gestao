import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './menu.css'

export default function Menu () {
  const url = useLocation()
  const [allowMenu, setAllowMenu] = useState(false)

  useEffect(() => {
    if (allowMenu)
      document.querySelector(".open-menu").addEventListener('click', () => {
        var menu = document.querySelector(".menu-container")
        if (getComputedStyle(menu, null).marginLeft === "0px") {
          menu.style.marginLeft = "-25vw"
        } else {
          menu.style.marginLeft = "0px"
        }
      })
  }, [allowMenu])

  useEffect(() => {
    if (url.pathname.indexOf("login") !== -1)
      setAllowMenu(false)
    else
      setAllowMenu(true)
    
    selectMenuOption()
  }, [url])

  function selectMenuOption() {

  }

  return (
    allowMenu ?
      
      <div className="menu-container">
        <i class="fas fa-bars open-menu"></i>

        <div className="menu-content">
          <div className="text-center logo-container mt-4"> 
            <Link to={"/dashboard"}>
              <img src={`${require("../images/LOGO.png").default}`} width="65%"/> 
            </Link>
          </div>

          <Link className="no-href-decoration" to="/dashboard">
            <div className="option-menu" id="dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</div>
          </Link>

          <Link className="no-href-decoration" to="/select-action">
            <div className="option-menu" id="venda"><i class="fas fa-hand-holding-usd"></i> Receber / Vender</div>
          </Link>

          <Link className="no-href-decoration" to="/cliente">
            <div className="option-menu" id="cliente"><i class="fas fa-users"></i> Cliente</div>
          </Link>

          <Link className="no-href-decoration" to="/produto">
            <div className="option-menu" id="produto"><i class="fas fa-store"></i> Produto</div>
          </Link>

          <Link className="no-href-decoration" to="/contas">
            <div className="option-menu" id="contas"><i class="fas fa-minus-circle"></i> Contas</div>
          </Link>

          <Link className="no-href-decoration" to="/estoque">
            <div className="option-menu" id="estoque"><i class="fas fa-boxes"></i> Estoque</div>
          </Link>

          <Link className="no-href-decoration" to="/login">
            <div className="option-menu"><i class="fas fa-sign-out-alt"></i> Sair</div>
          </Link>
          


        </div>
      </div>

    : <></>
  )
}