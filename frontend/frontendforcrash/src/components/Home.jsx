import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import Navbar from './Navbar';
import Card from './Card';
import AddProductModal from './AddProductModal';

function Home() {
    const [products,setProducts]=useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/products");
            const data=await res.json();
            console.log("API Response:",data);
            if(data.success){
                setProducts(data.data);
            } else {
                console.error("Error fetching products:", data.message);
            }
        } catch(error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(()=>{
        fetchProducts();
    },[]);

    const handleAddProduct = () => {
        fetchProducts(); // Refresh the product list
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                fetchProducts(); // Refresh the product list
            } else {
                alert('Error deleting product: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product: ' + error.message);
        }
    };

  return (
    <div className='min-h-screen w-full bg-gray-800'>
        <Navbar onSellClick={() => setShowAddModal(true)} />
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddProduct={handleAddProduct}
        />
        <div className='bold justify-center text-center py-5'>
            <h1 className='text-white text-2xl font-bold'>
                These are your products
            </h1>
        </div>
        <div>{products.length > 0 ? (
          <div className="gap-10 flex flex-row flex-wrap justify-center p-5">
            {products.map((p) => (
              <Card key={p._id} product={p} onDelete={handleDeleteProduct} />
            ))}
          </div>
        ) : (
          <h2 className='text-white text-center'>No products found</h2>
        )}</div>
        
    </div>
  )
}

export default Home