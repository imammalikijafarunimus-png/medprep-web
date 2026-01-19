import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Gunakan .tsx agar lebih eksplisit (opsional tapi recommended)
import './index.css' // <--- WAJIB pakai .css jika ini file style

// Tanda '!' di akhir menjamin element root tidak null (Sudah Benar)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)