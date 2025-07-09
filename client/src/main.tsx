import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // <- Thêm dòng này
import './index.css'
import App from './App.tsx'
import 'antd/dist/reset.css'; // Ant Design 5+
import './index.css';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>  {/* <- Bọc App bằng BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
)
