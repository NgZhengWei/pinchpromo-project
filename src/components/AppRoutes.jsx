import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Customers from "../pages/Customers"
import Dashboard from "../pages/Dashboard"
import Inventory from "../pages/Inventory"
import Orders from "../pages/Orders"

const AppRoutes = () => {
  return (
    <div className='AppRoutes'>
        <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/inventory" element={<Inventory />}></Route>
            <Route path="/orders" element={<Orders />}></Route>
            <Route path="/customers" element={<Customers />}></Route>
        </Routes>
    </div>
  )
}

export default AppRoutes