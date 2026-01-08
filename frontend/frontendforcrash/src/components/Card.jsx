import React from 'react'
import { useCart } from '../context/CartContext'

function Card({product, onDelete}) {
  const { addToCart } = useCart();

  return (
    <div className='w-48 bg-gray-700 rounded-md flex flex-col overflow-hidden'>
      <img src={product.image} className='w-full h-40 object-cover' />
      <div className='p-2 text-white'>
          <div className='font-semibold'>{product.name}</div>
          <div className='text-gray-300 mb-2'>${product.price}</div>
          <div className='flex gap-2'>
            <button
              onClick={() => addToCart(product)}
              className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-sm'
            >
              Add to Cart
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className='flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-sm'
            >
              Delete
            </button>
          </div>
      </div>
    </div>
  )
}

export default Card