"use client";

import React, { useEffect, useState, useCallback } from 'react';
import CategoryForm from './components/CategoryForm'; // Assuming CategoryForm is in this path
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit3, Trash2, PlusCircle, Loader, AlertTriangle } from 'lucide-react'; // Added more icons
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { FiInbox } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null); // For initial fetch
  const [submissionError, setSubmissionError] = useState<string | null>(null); // For form submissions
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // Correctly instantiated router

  const fetchCategories = useCallback(async (isRetry = false) => {
    if(!isRetry) setLoading(true); // Only set main loading on initial fetch or manual refresh
    setInitialLoadError(null); // Clear previous errors on new fetch
    try {
      const response = await fetch('/api/admin/categories');
      const text = await response.text(); // Read as text first for better error handling
      if (!response.ok) {
        let errorMsg = `Failed to fetch categories. Status: ${response.status}`;
        try {
          const errorJson = JSON.parse(text);
          errorMsg = errorJson.message || errorMsg;
        } catch (e) {
          // If parsing text as JSON fails, use the text itself if it's not empty, or the status-based message
          if (text && text.length < 200) errorMsg = text; // Avoid showing huge HTML error pages
        }
        throw new Error(errorMsg);
      }
      const data = text ? JSON.parse(text) : [];
      setCategories(data);
    } catch (e: any) {
      console.error("Failed to fetch categories:", e);
      setInitialLoadError(e.message || "An unknown error occurred while fetching categories.");
    } finally {
      if(!isRetry) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
    setSubmissionError(null); // Clear submission errors when form closes
  };

  const handleFormSubmit = async (categoryData: Omit<Category, '_id'> | Category) => {
    setIsSubmitting(true);
    setSubmissionError(null); // Clear previous submission errors
    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory ? `/api/admin/categories/${editingCategory._id}` : '/api/admin/categories';

    const dataToSubmit: Partial<Category> = { 
      name: categoryData.name,
      description: categoryData.description,
      imageUrl: categoryData.imageUrl
    };
    // Remove undefined fields to avoid sending them
    Object.keys(dataToSubmit).forEach(key => dataToSubmit[key as keyof typeof dataToSubmit] === undefined && delete dataToSubmit[key as keyof typeof dataToSubmit]);


    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      const text = await response.text();
      if (!response.ok) {
        let errorMsg = `Operation failed. Status: ${response.status}`;
        try {
          const errorJson = JSON.parse(text);
          errorMsg = errorJson.message || errorMsg;
        } catch (e) {
          if (text && text.length < 200) errorMsg = text;
        }
        throw new Error(errorMsg);
      }
      await fetchCategories(true); // Re-fetch categories (as retry, so no full loading state)
      handleFormClose();
    } catch (e: any) {
      console.error("Failed to submit category:", e);
      setSubmissionError(e.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
    setSubmissionError(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
    setSubmissionError(null);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect existing products.')) {
      setSubmissionError(null); // Clear previous errors
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
        const text = await response.text();
        if (!response.ok) {
          let errorMsg = `Deletion failed. Status: ${response.status}`;
          try {
            const errorJson = JSON.parse(text);
            errorMsg = errorJson.message || errorMsg;
          } catch (e) {
            if (text && text.length < 200) errorMsg = text;
          }
          throw new Error(errorMsg);
        }
        await fetchCategories(true); // Re-fetch categories
      } catch (e: any) {
        console.error("Failed to delete category:", e);
        setSubmissionError(e.message || "An unexpected error occurred during deletion.");
      }
    }
  };

  if (loading && !categories.length && !initialLoadError) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-slate-50 text-slate-700 p-4">
        <Loader className="animate-spin text-4xl text-sky-600 mb-4" />
        <p className="text-lg">Loading Categories...</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Back Button - Corrected and Styled */}
      <Button 
        variant="outline" // Use your Button component's variants
        size="sm"       // Use your Button component's sizes
        onClick={() => router.back()}
        className="mb-6 flex items-center group text-sky-600 border-sky-600 hover:bg-sky-50"
        aria-label="Kembali"
      >
        <ChevronLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Category Management</h1>
        {!showForm && (
          <Button 
            onClick={handleAddNewCategory}
            className="bg-sky-600 hover:bg-sky-700 text-white" // Primary action color
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Category
          </Button>
        )}
      </div>
      
      {initialLoadError && !showForm && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
            <div className="flex">
                <div className="py-1"><AlertTriangle className="h-6 w-6 text-red-500 mr-3"/></div>
                <div>
                    <p className="font-bold">Error Fetching Categories</p>
                    <p className="text-sm">{initialLoadError}</p>
                    <Button variant="link" onClick={() => fetchCategories()} className="text-red-700 hover:text-red-900 p-0 h-auto mt-1">
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
      )}

      {showForm ? (
        <CategoryForm 
          onClose={handleFormClose} 
          onSubmit={handleFormSubmit} 
          initialData={editingCategory || undefined}
          isSubmitting={isSubmitting}
          submissionError={submissionError} // Pass submission error to form
          onCancel={handleFormClose} // Add this line
        />
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {loading && categories.length > 0 && <div className="p-4 text-center text-slate-500">Refreshing categories...</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Image</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-6 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {categories.length === 0 && !loading && !initialLoadError && (
                  <tr>
                    <td colSpan={4} className="py-10 px-6 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                            <FiInbox className="text-5xl text-slate-400 mb-3" />
                            <p className="font-semibold">No categories found.</p>
                            <p className="text-sm">Click "Add New Category" to get started.</p>
                        </div>
                    </td>
                  </tr>
                )}
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 border-b border-slate-200">
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="h-12 w-12 object-cover rounded-md shadow-sm" />
                      ) : (
                        <div className="h-12 w-12 bg-slate-200 rounded-md flex items-center justify-center text-slate-400 text-xs">No Image</div>
                      )}
                    </td>
                    <td className="py-3 px-6 border-b border-slate-200 text-sm font-medium text-slate-800">{category.name}</td>
                    <td className="py-3 px-6 border-b border-slate-200 text-sm text-slate-600 max-w-xs truncate" title={category.description}>
                      {category.description || <span className="italic text-slate-400">No description</span>}
                    </td>
                    <td className="py-3 px-6 border-b border-slate-200 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditCategory(category)}
                          className="hover:bg-yellow-50 hover:text-yellow-700 border-yellow-500 text-yellow-600"
                        >
                          <Edit3 className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteCategory(category._id)}
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
    </div>
  );
}