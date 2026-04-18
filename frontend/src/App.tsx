// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import Register from './pages/register'
import Navbar from './layout/navbar'
import Footer from './layout/footer'
import Home from './pages/home'
import History from './pages/history'
import Analyze from './pages/anaylise'
import Profile from './pages/profile'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/profile" element={<Profile />} />
      </Routes >
      <Footer />
    </>
  )
}

export default App
