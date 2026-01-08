import React from 'react'
import Sell from './Sell'
import Cart from './Cart'

export default function Navbar() {
  return (
    <div className='h-px w-full bg-gray-900 flex items-center px-0 py-10 gap-10 sticky top-0 text-white z-40'>
      <Sell />
      <div className='px-2 text-xl font-normal'>
        Product Store
      </div>
      <div className='ml-auto pr-5'>
        <Cart />
      </div>
    </div>
  )
}
