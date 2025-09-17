import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './cpn/index.css'
import App from './cpn/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
