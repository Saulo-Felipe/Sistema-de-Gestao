import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './login/Login'
import Dashboard from './dashboard/Dashboard'
import Client from './client/Client'
import Product from './product/Product'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/client" element={<Client />} />
        <Route path="/produto" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;