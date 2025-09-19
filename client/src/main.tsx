import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { ToastProvider } from './contexts/ToastContext.tsx'
import { SearchProvider } from './contexts/SearchContext.tsx'

createRoot(document.getElementById('root')!).render(
  <SearchProvider>
  <BrowserRouter>
    <StrictMode>
       <ToastProvider>
        <AuthProvider>
         <App />
      </AuthProvider>
       </ToastProvider>
    </StrictMode>
  </BrowserRouter>
  </SearchProvider>
)

