import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import CartModal from './CartModal'

export default function Navbar({ onSellClick }) {
  const { getCartCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const cartCount = getCartCount();

  return (
    <>
      <div className='h-px w-full bg-gray-900 flex items-center px-0 py-10 gap-10 sticky top-0 text-white z-40'>
          <button
            onClick={onSellClick}
            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded ml-2'
          >
            Sell
          </button>
          
          <div className='px-2 text-xl font-normal'>
                Product Store
          </div>
          
          <div className='ml-auto pr-5'>
            <button
              onClick={() => setShowCart(true)}
              className='relative'
            >
              Cart ({cartCount})
            </button>
          </div>
      </div>
      
      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  )
}
