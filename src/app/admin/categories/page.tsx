'use client';

import React, { useEffect, useState, useCallback } from 'react';
import CategoryForm from './components/CategoryForm'; // Assuming CategoryForm is in this path

interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string; // Add imageUrl to the interface
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/categories');
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
      const data = text ? JSON.parse(text) : [];
      setCategories(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch categories:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async (categoryData: Omit<Category, '_id'> | Category) => {
    setIsSubmitting(true);
    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory ? `/api/admin/categories/${editingCategory._id}` : '/api/admin/categories';

    // Ensure imageUrl is included in categoryData if present
    const dataToSubmit: any = { name: categoryData.name };
    if ('description' in categoryData && categoryData.description) {
      dataToSubmit.description = categoryData.description;
    }
    if ('imageUrl' in categoryData && categoryData.imageUrl) {
      dataToSubmit.imageUrl = categoryData.imageUrl;
    }
    if (editingCategory && '_id' in categoryData) {
      // For PUT, we might send the whole category object or just updated fields
      // The current backend PUT /api/admin/categories/[id] expects the fields to update in the body
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit), // Use dataToSubmit
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

      await fetchCategories(); // Re-fetch categories to update the list
      handleFormClose();
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to submit category:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
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
        await fetchCategories(); // Re-fetch categories
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to delete category:", e);
      }
    }
  };

  if (loading && !categories.length) return <div className="p-4">Loading categories...</div>;
  // Show error prominently if it occurs
  if (error && !showForm) return <div className="p-4 text-red-500">Error: {error} <button onClick={() => fetchCategories()} className="ml-2 p-1 bg-blue-500 text-white rounded">Retry</button></div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      
      {!showForm && (
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition-colors"
          onClick={handleAddNewCategory}
        >
          Add New Category
        </button>
      )}
      
      {showForm && (
        <CategoryForm 
          onClose={handleFormClose} 
          onSubmit={handleFormSubmit} 
          initialData={editingCategory}
          isSubmitting={isSubmitting}
          submissionError={error} // Pass submission error to form
        />
      )}

      {!showForm && (
        <div className="overflow-x-auto mt-6">
          {loading && <p>Refreshing categories...</p>}
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Image</th> {/* Add Image column header */}
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-gray-500">No categories found.</td> {/* Adjusted colSpan */}
                </tr>
              )}
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{category.name}</td>
                  <td className="py-2 px-4 border-b">{category.description || 'N/A'}</td>
                  <td className="py-2 px-4 border-b"> {/* Add Image data cell */}
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button 
                      onClick={() => handleEditCategory(category)} 
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category._id)} 
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
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
    </div>
  );
}