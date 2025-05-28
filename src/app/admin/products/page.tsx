'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ProductForm from './components/ProductForm'; // Adjust path if needed

// Define a type for your product data (adjust based on your Mongoose model)
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string; // Assuming category is stored as ID. Adjust if it's an object.
  // Add other fields from your Product model
}

// Define a type for the form data, excluding _id for creation
interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  imageUrl: string;
  category: string;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      const text = await response.text();
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(text);
          errorMsg = errorJson.message || errorMsg;
        } catch (e) {
          // If error response is not JSON, use the text or default message
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }
      const data: Product[] = text ? JSON.parse(text) : [];
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFormSubmit = async (formData: ProductFormData, id?: string) => {
    setIsSubmitting(true);
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/products?id=${id}` : '/api/admin/products';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(text);
          errorMsg = errorJson.message || errorMsg;
        } catch (e) {
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }

      await fetchProducts(); // Refresh the list
      setShowForm(false);
      setEditingProduct(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to submit product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products?id=${id}`, {
          method: 'DELETE',
        });
        const text = await response.text();
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(text);
            errorMsg = errorJson.message || errorMsg;
          } catch (e) {
            errorMsg = text || errorMsg;
          }
          throw new Error(errorMsg);
        }
        await fetchProducts(); // Refresh the list
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to delete product:", err);
      }
    }
  };

  if (loading && !products.length) { // Show loading only on initial load
    return <div className="text-center mt-8">Loading products...</div>;
  }

  if (error && !showForm) { // Don't show page-level error if form is open (form can have its own error display)
    return <div className="text-center mt-8 text-red-600">Error: {error} <button onClick={fetchProducts} className='ml-2 p-1 bg-blue-500 text-white rounded'>Retry</button></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Products Management</h1>

      {showForm ? (
        <ProductForm
          initialData={editingProduct ? { ...editingProduct, price: String(editingProduct.price) } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
            setError(null); // Clear page-level error when closing form
          }}
          isSubmitting={isSubmitting}
        />
      ) : (
        <button
          onClick={handleAddNewProduct}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Add New Product
        </button>
      )}
      
      {error && showForm && <div className="mt-4 text-red-600">Error submitting form: {error}</div>} {/* Error specific to form submission */}

      {/* Product Listing Table */}
      {!showForm && products.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
                <th className="py-2 px-4 border-b text-left">Category ID</th>
                <th className="py-2 px-4 border-b text-left">Image</th> {/* Added Image Header */}
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</td>
                  <td className="py-2 px-4 border-b">{product.category || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      'No Image'
                    )} {/* Added Image Data Cell */}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-yellow-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!showForm && !loading && products.length === 0 && (
         <div className="text-center mt-8">No products found.</div>
      )}
    </div>
  );
};

export default AdminProductsPage;