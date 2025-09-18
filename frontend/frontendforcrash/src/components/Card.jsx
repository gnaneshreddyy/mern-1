import React from 'react'

function Card({product}) {
  return (
    <div className='w-20 h-30 bg-blue-700 rounded-md flex flex-column'>
      <div className='mt-0 pl-2 overflow-hidden'>
          {product.name}
      </div>
      <img src={product.img} className='w-full h-40 object-cover rounded-md mb-3' />

    </div>
  )
}

export default Card