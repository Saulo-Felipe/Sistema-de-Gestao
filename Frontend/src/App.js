import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './login/Login'
import Dashboard from './dashboard/Dashboard'
import Client from './client/Client'
import Product from './product/Product'
import SelectAction from './sale/SelectAction'
import Sale from "./sale/Sale"
import Receive from "./sale/Receive"
import Menu from './menu/Menu'
import Stock from './stock/Stock'
import RequireAuth from "./services/PrivateRoutes"
import Error404 from "./not-found-page/Error404"


function App() {
  return (
    <BrowserRouter>
      <div className="menu-content-container">
        <Menu />
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/dashboard" element={<RequireAuth> <Dashboard /> </RequireAuth>} />
          <Route path="/cliente" element={<RequireAuth> <Client /> </RequireAuth>} />
          <Route path="/produto" element={<RequireAuth> <Product /> </RequireAuth>} />

          <Route path="/select-action" exact element={<RequireAuth> <SelectAction /> </RequireAuth>} />
          <Route path="/select-action/venda" element={<RequireAuth> <Sale /> </RequireAuth>} />
          <Route path="/select-action/receber" element={<RequireAuth> <Receive /> </RequireAuth>} />

          <Route path="/estoque" element={<RequireAuth> <Stock /> </RequireAuth>} />
          <Route path="*" element={<RequireAuth> <Error404 /> </RequireAuth>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;