import React from 'react'
import { Link } from 'react-router-dom'
import './sale.css'


export default function FinishNotify() {



  return (
    <div className="w-100">
      <div className="container finish-sale-last">
        <div className="success-icon"><i class="fas fa-check"></i></div>
        <div className="small-title finish-sale-title">Venda Finalizada com sucesso!</div>
      </div>
      <div className="container mt-2 text-center">

        <button className="finalize-btn-success" onClick={() => window.location.reload()}>Realizar uma nova venda</button>

        <Link to="/dashboard">
          <button className="finalize-btn-blue">Página inicial <i class="fas fa-home"></i></button>
        </Link>
      </div>
    </div>
  )
}
