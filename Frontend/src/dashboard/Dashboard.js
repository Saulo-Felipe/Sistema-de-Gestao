import React from 'react'
import { Link } from 'react-router-dom'
import './dashboard.css'

export default function Dashboard() {
  return (
    <div id="dashboard">
      <h1 className="big-tittle">Sistema de gestão</h1>
      <div className="cards-dashboard">
        
        <Link to="/venda" className="no-haref-decoration">
          <div className="card-dashboard">Venda</div>
        </Link>
          
        <Link to="/client" className="no-haref-decoration">
          <div className="card-dashboard">Cliente</div>
        </Link>

        <Link to="/produto" className="no-haref-decoration">
          <div className="card-dashboard">Produto</div>
        </Link>

      </div>
    </div>
  )
}
