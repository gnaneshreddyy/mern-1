import React from 'react';
import { useCart } from '../context/CartContext';

function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, getCartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={onClose}>
      <div className='bg-gray-800 rounded-lg w-96 max-h-[80vh] flex flex-col' onClick={(e) => e.stopPropagation()}>
        <div className='p-4 border-b border-gray-700'>
          <div className='flex items-center justify-between'>
            <h2 className='text-white text-2xl font-bold'>Cart</h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-white text-xl'
            >
              ×
            </button>
          </div>
        </div>
        
        <div className='flex-1 overflow-y-auto p-4'>
          {cart.length === 0 ? (
            <div className='text-white text-center py-8'>
              Your cart is empty
            </div>
          ) : (
            <div className='space-y-3'>
              {cart.map((item) => (
                <div key={item._id} className='flex items-center justify-between p-3 bg-gray-700 rounded'>
                  <div className='flex-1'>
                    <div className='text-white font-semibold'>{item.name}</div>
                    <div className='text-gray-400 text-sm'>
                      ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className='text-red-400 hover:text-red-300 text-sm ml-2'
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className='p-4 border-t border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-white text-lg font-semibold'>Total:</span>
              <span className='text-white text-xl font-bold'>
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => {
                // Placeholder - does nothing for now
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
  );
}

export default CartModal;
