import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  BrowserRouter , Routes , Route  } from 'react-router-dom';
import Login from "./Login.jsx"
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/login" element={<Login />}></Route>
    </Routes>
  </BrowserRouter>
)
