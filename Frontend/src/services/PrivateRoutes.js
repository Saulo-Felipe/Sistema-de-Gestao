import React from 'react'
import { Route, Navigate } from 'react-router-dom'


function verifyAuth() {
  const token = localStorage.getItem("login_token")

  if (token)
    return true
  else 
    return false
}

export default function RequireAuth({ children }) {
  let isAuth = verifyAuth()

  if (!isAuth) {
    return <Navigate to="/login" />
  }

  return children
}