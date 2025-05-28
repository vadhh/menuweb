"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react"; // Added useCallback
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import MenuItemCard from "@/components/MenuItemCard"; // Assuming this component is well-styled
import CartDrawerContent from "@/components/CartDrawerContent";
import { ShoppingCart, Minus, Plus, ChevronDown, Globe } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { addToCart, decreaseQuantity, removeFromCart } from '@/lib/redux/cartSlice';

// Helper for class names
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

// Define interfaces for your data (ensure these match your Mongoose models)
interface Category {
  _id: string;
  name: string;
  imageUrl?: string; // For category images
  // description?: string; // If categories have descriptions you want to use
}

// Update the Product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string; // Changed from categoryId to category
  description?: string;
}

// A helper function for fetching and parsing JSON to reduce repetition
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errorJson = JSON.parse(text);
      errorMsg = errorJson.message || errorMsg;
    } catch (e) {
      // If parsing error text as JSON fails, use the raw text or default message
      errorMsg = text || errorMsg;
    }
    throw new Error(errorMsg);
  }
  try {
    return JSON.parse(text) as T;
  } catch (e: any) {
    // Handle cases where text is not valid JSON even with a 2xx response
    console.error("Failed to parse JSON response:", text, e);
    throw new Error("Invalid JSON response from server.");
  }
}

export default function HomePage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null); // Default to null (or 'popular' if you want it pre-selected)

  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Unified loading state
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch categories and products in parallel
      const [categoriesData, productsData] = await Promise.all([
        fetchData<Category[]>('/api/admin/categories'), // Ensure this API returns Category[]
        fetchData<Product[]>('/api/admin/products')    // Ensure this API returns Product[]
      ]);

      // Manually add 'popular' category if needed for UI
      // Ensure its structure matches the Category interface
      const popularCategory: Category = {
        _id: 'popular',
        name: 'Populer',
        // If 'popular' should have an image, provide it here or ensure it's handled in rendering
        imageUrl: 'https://em-content.zobj.net/source/apple/419/ok-hand_light-skin-tone_1f44c-1f3fb_1f3fb.png' // Example: using a local public image for 'Populer'
      };
      setCategories([popularCategory, ...categoriesData]);
      setAllProducts(productsData);

    } catch (err: any) {
      console.error("Failed to load menu data:", err);
      setError(err.message || "An unknown error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Update the filtering logic
  const filteredProducts = activeCategoryId && activeCategoryId !== 'popular'
    ? allProducts.filter(product => product.category === activeCategoryId)
    : allProducts;

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product._id, // Use _id from fetched data
      name: product.name,
      price: product.price,
      quantity: 1,
      // imageUrl: product.imageUrl
    }));
  };

  const handleIncreaseQuantity = (productId: string) => {
    dispatch(addToCart({ id: productId, name: '', price: 0 }));
  };

  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity === 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(decreaseQuantity(productId));
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading menu...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600">
        Error loading menu: {error}
        <button 
          onClick={loadData} // Retry calls loadData again
          className='ml-2 p-1 bg-blue-500 text-white rounded'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-red-600 font-bold text-2xl tracking-tight">
              Bakso Lebam
            </Link>
            
          <nav className="flex items-center gap-3 sm:gap-4">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="text-gray-700 hover:bg-gray-100 px-2 sm:px-3 py-1.5 flex items-center gap-1 text-sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Globe size={18} className="text-gray-600" />
                <span className="hidden sm:inline">English</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-white shadow-xl rounded-md p-2 z-50 border border-gray-200"
                >
                  {['English', 'Indonesia', '한글'].map(lang => (
                    <button
                      key={lang}
                      className="w-full text-left text-gray-700 hover:bg-red-50 hover:text-red-600 p-2 rounded-md text-sm transition-colors duration-150"
                      onClick={() => {
                        console.log(`${lang} selected`); // Implement language change logic
                        setIsDropdownOpen(false);
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" className="relative p-2 hover:bg-red-50 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-red-600 transition-colors" />
                  {totalCartQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {totalCartQuantity}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-white flex flex-col rounded-t-2xl h-[85vh] mt-24 fixed bottom-0 left-0 right-0 outline-none">
                <CartDrawerContent cartItems={cartItems} dispatch={dispatch} />
              </DrawerContent>
            </Drawer>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-5">
        {/* Category Section */}
        <section className="mb-6">
          <div className="flex overflow-x-auto p-3 -mx-1 space-x-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {categories.map(category => (
              <button
                key={category._id} // Use _id from fetched data
                onClick={() => setActiveCategoryId(category._id === activeCategoryId ? null : category._id)} 
                className={cn(
                  "flex-none min-w-[90px] px-3 py-2.5 rounded-lg shadow-sm border transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400",
                  activeCategoryId === category._id
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50"
                )}
              >
                <div className="flex flex-col items-center justify-center">
                  <img
                    className="w-8 h-8 object-contain mb-1.5"
                    src={category.imageUrl || 'https://via.placeholder.com/40/E0E0E0/999999?text=Icon'} // Changed from iconUrl to imageUrl
                    alt={category.name}
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40/E0E0E0/999999?text=Icon')}
                  />
                  <p className="text-xs font-medium text-center whitespace-nowrap">{category.name}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Product Listing Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {activeCategoryId && activeCategoryId !== 'popular' 
              ? categories.find(c => c._id === activeCategoryId)?.name 
              : activeCategoryId === 'popular' 
              ? 'Populer' 
              : 'Semua Menu'}
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6">
              {filteredProducts.map(product => {
                const cartItem = cartItems.find(item => item.id === product._id); // Use _id
                const quantity = cartItem ? cartItem.quantity : 0;
                return (
                  <MenuItemCard
                    key={product._id} // Use _id
                    product={product} // Pass the whole product object
                    quantity={quantity}
                    onAddToCart={() => handleAddToCart(product)}
                    onIncrease={() => handleIncreaseQuantity(product._id)} // Use _id
                    onDecrease={() => handleDecreaseQuantity(product._id, quantity)} // Use _id
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No products found in this category.</p>
          )}
        </section>
      </main>
    </div>
  );
}