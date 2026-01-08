import React from 'react'
import Home from './components/Home'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <Home />
    </CartProvider>
  )
}
