import React from 'react'
import { Link } from 'react-router-dom'
import './dashboard.css'

export default function Dashboard() {
  return (
    <div className="w-100">
      
      <div className="dashboard-content">

        <div className="cards-dashboard">          
          <h1 className="big-title">Sistema de gestão</h1>
          <div>
            
            <div className="dashboard-card-center">
              <Link to="/select-action" className="no-haref-decoration href-dashboard-card">
                <div className="card-dashboard">Pagamento <i class="fas fa-hand-holding-usd"></i></div>
              </Link>
            </div>
          
            <div className="dashboard-card-center">
              <Link to="/cliente" className="no-haref-decoration href-dashboard-card">
                <div className="card-dashboard">Cliente <i class="fas fa-users"></i></div>
              </Link>    
            </div>

            <div className="dashboard-card-center">
              <Link to="/produto" className="no-haref-decoration href-dashboard-card">
                <div className="card-dashboard">Produto <i class="fas fa-store"></i></div>
              </Link>
            </div>

            <div className="dashboard-card-center">
              <Link to="/produto" className="no-haref-decoration href-dashboard-card" style={{marginTop: "20%"}}>
                <div className="card-dashboard">Contas <i class="fas fa-minus-circle"></i></div>
              </Link>
            </div>

            <div className="dashboard-card-center">
              <Link to="/estoque" className="no-haref-decoration href-dashboard-card" style={{marginTop: "20%"}}>
                <div className="card-dashboard">Estoque <i class="fas fa-boxes"></i></div>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
