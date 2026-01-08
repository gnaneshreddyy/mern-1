import React, { useState, useEffect } from 'react';

function Cards() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Refetch every 2 seconds to get updates
    const interval = setInterval(fetchProducts, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts(); // Refresh immediately
      } else {
        alert('Error deleting product: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (data.success) {
        // Trigger immediate cart refresh
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        alert('Error adding to cart: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    }
  };

  if (loading) {
    return <div className='text-white text-center py-8'>Loading products...</div>;
  }

  return (
    <div className="gap-10 flex flex-row flex-wrap justify-center p-5">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className='w-48 bg-gray-700 rounded-md flex flex-col overflow-hidden'>
            <img src={product.image} className='w-full h-40 object-cover' alt={product.name} />
            <div className='p-2 text-white'>
              <div className='font-semibold'>{product.name}</div>
              <div className='text-gray-300 mb-2'>${product.price}</div>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-sm'
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-sm'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h2 className='text-white text-center w-full'>No products found</h2>
      )}
    </div>
  );
}

export default Cards;
