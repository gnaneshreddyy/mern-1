import React, { useState } from 'react';

function Sell({ onProductAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          image: formData.image,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (data.success) {
        setFormData({ name: '', price: '', image: '' });
        setIsOpen(false);
        // Trigger refresh - Cards component will auto-refresh via polling
        if (onProductAdded) onProductAdded();
      } else {
        alert('Error adding product: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        alert('Error: Cannot connect to server. Make sure the backend is running on http://localhost:5000');
      } else {
        alert('Error adding product: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded ml-2 text-white'
      >
        Sell
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={() => setIsOpen(false)}>
          <div className='bg-gray-800 p-6 rounded-lg w-96' onClick={(e) => e.stopPropagation()}>
            <h2 className='text-white text-2xl font-bold mb-4'>Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-white mb-2'>Product Name</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full px-3 py-2 bg-gray-700 text-white rounded'
                  placeholder='Enter product name'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-white mb-2'>Price</label>
                <input
                  type='number'
                  step='0.01'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className='w-full px-3 py-2 bg-gray-700 text-white rounded'
                  placeholder='Enter price'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-white mb-2'>Image URL</label>
                <input
                  type='text'
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className='w-full px-3 py-2 bg-gray-700 text-white rounded'
                  placeholder='Enter image URL'
                />
              </div>
              <div className='flex gap-2'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Sell;
