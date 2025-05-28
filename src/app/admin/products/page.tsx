"use client";

import React, { useEffect, useState, useCallback } from 'react';
import ProductForm from './components/ProductForm'; // Adjust path if needed
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit3, Trash2, PlusCircle, Loader, AlertTriangle, FileImage, DollarSign, Tag, Archive, Inbox } from 'lucide-react'; // Using Lucide icons as per CategoriesPage
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { FiImage, FiArchive, FiDollarSign, FiTag, FiInbox } from 'react-icons/fi';

// Define a type for your product data (adjust based on your Mongoose model)
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string; // Assuming category is stored as ID. Could be an object if populated.
  // Add other fields from your Product model
}

// Define a type for the form data, excluding _id for creation
interface ProductFormData {
  name: string;
  description: string;
  price: number | string; // Input type="number" can still give string
  imageUrl: string;
  category: string; // This should be the category ID string
}

// Helper for currency formatting (consistent with AdminOrdersPage)
const formatCurrency = (amount: number, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', { // locale for Indonesia
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};


const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // Correctly instantiated router

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setInitialLoadError(null);
    try {
      const response = await fetch('/api/admin/products'); // Ensure this API endpoint exists and returns products
      const text = await response.text();
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(text);
          errorMsg = errorJson.message || errorMsg;
        } catch (e) {
          if (text && text.length < 200) errorMsg = text;
        }
        throw new Error(errorMsg);
      }
      const data: Product[] = text ? JSON.parse(text) : [];
      setProducts(data);
    } catch (err: any) {
      setInitialLoadError(err.message || "An unknown error occurred while fetching products.");
      console.error("Failed to fetch products:", err);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    setSubmissionError(null);
  };

  const handleFormSubmit = async (formData: ProductFormData, id?: string) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    const method = id ? 'PUT' : 'POST';
    // Adjust URL if your PUT uses /api/admin/products/${id} instead of query param
    const url = id ? `/api/admin/products?id=${id}` : '/api/admin/products';

    // Ensure price is a number before sending
    const dataToSubmit = {
        ...formData,
        price: parseFloat(String(formData.price)) // Ensure price is number
    };

    if (isNaN(dataToSubmit.price)) {
        setSubmissionError("Price must be a valid number.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      const text = await response.text();
      if (!response.ok) {
        let errorMsg = `Failed to save product. Status: ${response.status}`;
        try {
          const errorJson = JSON.parse(text);
          errorMsg = errorJson.message || errorMsg;
        } catch (e) {
          if (text && text.length < 200) errorMsg = text;
        }
        throw new Error(errorMsg);
      }
      await fetchProducts(true); // Refresh the list (soft refresh)
      handleFormClose();
    } catch (err: any) {
      setSubmissionError(err.message || "An unexpected error occurred.");
      console.error("Failed to submit product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
    setSubmissionError(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
    setSubmissionError(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setSubmissionError(null);
      try {
        // Adjust URL if your DELETE uses /api/admin/products/${id}
        const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
        const text = await response.text();
        if (!response.ok) {
          let errorMsg = `Failed to delete product. Status: ${response.status}`;
          try {
            const errorJson = JSON.parse(text);
            errorMsg = errorJson.message || errorMsg;
          } catch (e) {
            if (text && text.length < 200) errorMsg = text;
          }
          throw new Error(errorMsg);
        }
        await fetchProducts(true); // Refresh the list
      } catch (err: any) {
        setSubmissionError(err.message || "An unexpected error occurred during deletion.");
        console.error("Failed to delete product:", err);
      }
    }
  };


  if (loading && !products.length && !initialLoadError) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-slate-50 text-slate-700 p-4">
        <Loader className="animate-spin text-4xl text-sky-600 mb-4" />
        <p className="text-lg">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="mb-6 flex items-center group text-sky-600 border-sky-600 hover:bg-sky-50"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Products Management</h1>
        {!showForm && (
          <Button
            onClick={handleAddNewProduct}
            className="bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Button>
        )}
      </div>

      {initialLoadError && !showForm && (
         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
            <div className="flex">
                <div className="py-1"><AlertTriangle className="h-6 w-6 text-red-500 mr-3"/></div>
                <div>
                    <p className="font-bold">Error Fetching Products</p>
                    <p className="text-sm">{initialLoadError}</p>
                    <Button variant="link" onClick={() => fetchProducts()} className="text-red-700 hover:text-red-900 p-0 h-auto mt-1">
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
      )}
      
      {showForm ? (
        <ProductForm
          initialData={editingProduct ? {
            ...editingProduct,
            price: String(editingProduct.price), // ProductForm might expect price as string initially
            description: editingProduct.description || '',
            imageUrl: editingProduct.imageUrl || '',
            // Ensure category (ID) is passed if your form needs it
            category: editingProduct.category || '', 
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          isSubmitting={isSubmitting}
          submissionError={submissionError} // Pass submission error to form
        />
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
           {loading && products.length > 0 && <div className="p-4 text-center text-slate-500 border-b border-slate-200">Refreshing products list...</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"> Image</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"> Name</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"> Price</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"> Category ID</th>
                  <th className="py-3 px-6 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {products.length === 0 && !loading && !initialLoadError && (
                  <tr>
                    <td colSpan={5} className="py-10 px-6 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                            <FiInbox className="text-5xl text-slate-400 mb-3" />
                            <p className="font-semibold">No products found.</p>
                            <p className="text-sm">Click "Add New Product" to get started.</p>
                        </div>
                    </td>
                  </tr>
                )}
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 border-b border-slate-200">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover rounded-md shadow-sm" />
                      ) : (
                        <div className="h-12 w-12 bg-slate-200 rounded-md flex items-center justify-center text-slate-400 text-xs">No Image</div>
                      )}
                    </td>
                    <td className="py-3 px-6 border-b border-slate-200 text-sm font-medium text-slate-800">{product.name}</td>
                    <td className="py-3 px-6 border-b border-slate-200 text-sm text-slate-600">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-6 border-b border-slate-200 text-sm text-slate-600 truncate max-w-xs" title={product.category}>{product.category || <span className="italic text-slate-400">N/A</span>}</td>
                    <td className="py-3 px-6 border-b border-slate-200 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="hover:bg-yellow-50 hover:text-yellow-700 border-yellow-500 text-yellow-600"
                        >
                          <Edit3 className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                          className="hover:bg-red-50 hover:text-red-700 border-red-500 text-red-600"
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {submissionError && showForm && ( // Show submission error clearly, perhaps near the form
        <div className="mt-4 bg-red-100 border border-red-300 text-red-700 p-3 rounded-md text-sm text-center" role="alert">
            <p className="font-semibold">Could not save product:</p>
            <p>{submissionError}</p>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;