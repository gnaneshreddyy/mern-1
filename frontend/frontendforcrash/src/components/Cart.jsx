import React, { useState, useEffect } from 'react';

function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart");
      const data = await res.json();
      if (data.success) {
        setCartItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
      // Refetch cart every 2 seconds when modal is open
      const interval = setInterval(fetchCart, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleRemove = async (cartItemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchCart(); // Refresh immediately
      } else {
        alert('Error removing item: ' + data.message);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item');
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.productId;
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='text-white'
      >
        Cart ({getCartCount()})
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={() => setIsOpen(false)}>
          <div className='bg-gray-800 rounded-lg w-96 max-h-[80vh] flex flex-col' onClick={(e) => e.stopPropagation()}>
            <div className='p-4 border-b border-gray-700'>
              <div className='flex items-center justify-between'>
                <h2 className='text-white text-2xl font-bold'>Cart</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className='text-gray-400 hover:text-white text-xl'
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className='flex-1 overflow-y-auto p-4'>
              {loading ? (
                <div className='text-white text-center py-8'>Loading cart...</div>
              ) : cartItems.length === 0 ? (
                <div className='text-white text-center py-8'>
                  Your cart is empty
                </div>
              ) : (
                <div className='space-y-3'>
                  {cartItems.map((item) => {
                    const product = item.productId;
                    if (!product) return null;
                    return (
                      <div key={item._id} className='flex items-center justify-between p-3 bg-gray-700 rounded'>
                        <div className='flex-1'>
                          <div className='text-white font-semibold'>{product.name}</div>
                          <div className='text-gray-400 text-sm'>
                            ${product.price} × {item.quantity} = ${(product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className='text-red-400 hover:text-red-300 text-sm ml-2'
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className='p-4 border-t border-gray-700'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='text-white text-lg font-semibold'>Total:</span>
                  <span className='text-white text-xl font-bold'>
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    console.log('Proceed to Buy clicked');
                  }}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold'
                >
                  Proceed to Buy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
