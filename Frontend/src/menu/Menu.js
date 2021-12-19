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
  }, [url])


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

          <div className="option-menu"><i class="fas fa-tachometer-alt"></i> Dashboard</div>
          <div className="option-menu">Option1</div>
          <div className="option-menu">Option1</div>
          <div className="option-menu">Option1</div>
        </div>
      </div>

    : <></>
  )
}