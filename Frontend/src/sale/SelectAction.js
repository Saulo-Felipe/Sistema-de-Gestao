import React from 'react'
import { Link } from 'react-router-dom'
import './receive.css'

export default function SelectAction() {



  return (
    <div className="w-100">
      <div className="cards-select-action">

        <Link to="/select-action/venda" className="no-href-decoration">
          <div className="card-select-action ml-5">Vender <i class="fas fa-receipt"></i></div>
        </Link>

        <Link to="/select-action/receber" className="no-href-decoration">
          <div className="card-select-action mr-5">Receber <i class="fas fa-money-check-alt"></i></div>
        </Link>

      </div>
    </div>
  )
}

