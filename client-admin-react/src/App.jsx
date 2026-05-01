// src/App.jsx
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app/router/AppRoutes'
import './styles/auth.css'
import './styles/dashboard.css'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App