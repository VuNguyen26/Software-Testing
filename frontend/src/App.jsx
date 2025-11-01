import React, { useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import ProductForm from './components/ProductForm.jsx'

export default function App() {
  const [token, setToken] = useState(null)
  return (
    <div style={{fontFamily: 'system-ui, Arial', padding: 24}}>
      <h1>FloginFE — React + Vite</h1>
      {!token ? (
        <LoginForm onSuccess={setToken} />
      ) : (
        <div>
          <p>Logged in. Token: <code>{token}</code></p>
          <ProductForm token={token} />
        </div>
      )}
    </div>
  )
}