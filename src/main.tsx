import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 1. Import Speed Insights
import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {/* 2. Pasang Komponen di sini (Tidak akan terlihat di layar, cuma memantau di background) */}
    <SpeedInsights />
  </React.StrictMode>,
)