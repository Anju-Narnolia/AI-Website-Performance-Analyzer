// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import Register from './pages/register'
import Navbar from './pages/layout/navbar'
import Footer from './pages/layout/footer'
import Home from './pages/home'
import DashboardPreview from './pages/dashboard'
import Analyze from './pages/anaylise'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPreview />} />  
        <Route path="/analyze" element={<Analyze />} />
      </Routes >
      <Footer />
    </>
  )
}

export default App
