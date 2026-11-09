import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { TaskProvider } from './TaskContext.jsx'
import { NavProvider } from "./Nav"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TaskProvider>
        <NavProvider>
          <App />
        </NavProvider>
      </TaskProvider>
    </BrowserRouter>
  </StrictMode>,
)
