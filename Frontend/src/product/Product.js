import React from 'react'
import { Link } from 'react-router-dom'
import './product.css'



export default function Client() {

  return (
    <div className="">

      <div className="container-form container mt-5 ">
        <div className="medium-tittle text-center p-0">Cadastro de Produto</div>

        <div className="one-form-input">
          <label htmlFor="product_name">Nome do produto</label>
          <input className="input-default" type="text" id="product_name" placeholder="Digite o nome do produto" />
        </div>

        <div className="one-form-input">
          <label htmlFor="product_marca">Marca do produto</label>
          <input className="input-default" type="text" id="product_marca" placeholder="Digite o nome da marca do produto" />
        </div>

        <div className="one-form-input">
          <label htmlFor="product_quantidade">Quantidade</label>
          <input className="input-default" type="number" id="product_quantidade" placeholder="Digite a quantidade para ser cadastrado" defaultValue="1"/>
        </div>

        <div className="container-product-form mt-1">
          <div className="one-form-input">
            <label htmlFor="custo_produto">Custo do Produto (R$)</label>
            <input className="input-default" type="number" id="custo_produto" placeholder="Digite o preço de custo do produto" />
          </div>

          <div className="one-form-input">
            <label htmlFor="price_revenda">Preço de Revenda (R$)</label>
            <input className="input-default" type="number" id="price_revenda" placeholder="Digite o preço de revenda do produto" />
          </div>
        </div>
        
        <div className="text-right mt-4">
          <Link to="/dashboard">
            <button className="btn-red mr-2">Cancelar</button>            
          </Link>
          <button className="btn-blue">Cadastrar</button>
        </div>


      </div>

    

    </div>
  )
}
