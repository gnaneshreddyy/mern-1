import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import Navbar from './Navbar';

import Card from './Card'        
function Home() {
    const [products,setProducts]=useState([]);

    useEffect(()=>{
        async function fetchprod(){
            const res = await fetch("http://localhost:5000/api/products");
            const data=await res.json();
            console.log("API Response:",data);
            console.log("success is :",data.success);
            setProducts(data.data);
        }
        fetchprod();
    },[])
  return (
    <div className='min-h-screen w-full bg-blue-200'>

        <Navbar/>
        <div className='bold justify-center text-center'>
            <h1>
                These are your products
            </h1>
        </div>
        <div>{products.length > 0 ? (
          <div className="gap-10 flex flex-row  justify-center p-5">
            {products.map((p) => (
              <Card key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <h2>No products found</h2>
        )}</div>
        
    </div>
  )
}

export default Home