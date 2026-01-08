import React from 'react'
import Navbar from './Navbar';
import Cards from './Cards';

function Home() {
  return (
    <div className='min-h-screen w-full bg-gray-800'>
      <Navbar />
      <div className='bold justify-center text-center py-5'>
        <h1 className='text-white text-2xl font-bold'>
          These are your products
        </h1>
      </div>
      <Cards />
    </div>
  )
}

export default Home
