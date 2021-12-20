import React from 'react'
import './nomatch.css'


export default function Error404() {
  return (
    <div className="w-100">
      <h1 className="no-match-404">404</h1>
      <div className="no-match-title">Pagina não encontrada :/</div>
      <div className="no-match-subtitle">Essa Página não existe no nosso sistema</div>
    </div>
  )
}
