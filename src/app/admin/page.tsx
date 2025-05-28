"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
    FiShoppingCart, 
    FiLogIn, 
    FiLoader, 
    FiBox, 
    FiGrid, 
    FiLogOut, 
    FiChevronLeft, // Kept as it was in imports
    FiAlertCircle // For error messages
} from 'react-icons/fi'; 
// import { Button } from '@/components/ui/button'; // Not used in this file directly

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    completed: 0,
    processing: 0, // Changed from 'processed' to 'processing' for consistency
  });
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [errorCounts, setErrorCounts] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        setLoadingCounts(true);
        setErrorCounts(null); // Clear previous errors
        const response = await fetch('/api/orders?type=counts'); // Assuming this API endpoint exists
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty if fails
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrderCounts({
            pending: data.pending || 0,
            completed: data.completed || 0,
            processing: data.processing || data.processed || 0 // Accommodate 'processed' or 'processing'
        });
      } catch (error) {
        console.error('Error fetching order counts:', error);
        setErrorCounts('Failed to load order summary.');
      } finally {
        setLoadingCounts(false);
      }
    };

    if (session && status === 'authenticated') { // Ensure session is truly authenticated
      fetchOrderCounts();
    }
  }, [session, status]); // Added status to dependency array

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <FiLoader className="animate-spin text-4xl text-sky-600 mb-4" />
        <p className="text-slate-700 text-lg">Loading Admin Panel...</p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/admin" className="flex-shrink-0 text-xl sm:text-2xl font-bold text-sky-600 hover:text-sky-700 transition-colors">
                  Admin Dashboard
                </Link>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <span className="text-sm text-slate-600 hidden md:block">
                  Welcome, <span className="font-medium">{session.user?.name || session.user?.email}</span>!
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center text-sm text-slate-600 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  title="Logout"
                >
                  <FiLogOut className="h-5 w-5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="py-8 md:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:hidden mb-6 text-center">
              <p className="text-lg text-slate-700">
                Welcome, <span className="font-semibold">{session.user?.name || session.user?.email}</span>!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"> {/* Adjusted to 2 columns for primary cards */}
              
              {/* Orders Section Card - STYLED */}
              <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="flex items-center mb-4">
                  <FiShoppingCart className="text-3xl text-sky-500 mr-4" />
                  <h2 className="text-xl lg:text-2xl font-semibold text-slate-700">Orders Overview</h2>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  View and manage customer orders, track statuses, and handle order fulfillment. Get a quick summary below.
                </p>

                {/* Order Counts Section - STYLED */}
                {loadingCounts ? (
                  <div className="flex items-center justify-center h-24 my-4"> {/* Adjusted height */}
                    <FiLoader className="animate-spin text-3xl text-sky-500" />
                  </div>
                ) : errorCounts ? (
                  <div className="bg-red-50 p-3 rounded-md text-sm text-red-700 text-center my-4 flex items-center justify-center">
                    <FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {errorCounts}
                  </div>
                ) : (
                  <div className="my-4 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Summary</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-yellow-700 font-semibold uppercase">Pending</p>
                        <p className="text-2xl font-bold text-yellow-800">{orderCounts.pending}</p>
                      </div>
                      <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-sky-700 font-semibold uppercase">Processing</p>
                        <p className="text-2xl font-bold text-sky-800">{orderCounts.processing}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-green-700 font-semibold uppercase">Completed</p>
                        <p className="text-2xl font-bold text-green-800">{orderCounts.completed}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* End Order Counts Section */}

                <Link href="/admin/orders" className="mt-auto">
                  <span className="inline-block w-full text-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg group transition-colors duration-200 shadow hover:shadow-md">
                    View All Orders
                    <span className="ml-2 inline-block transform group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                  </span>
                </Link>
              </div>

              {/* Manage Content Card */}
              <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col"> {/* Added flex flex-col */}
                <div className="flex items-center mb-4">
                  <FiGrid className="text-3xl text-purple-500 mr-4" />
                  <h2 className="text-xl lg:text-2xl font-semibold text-slate-700">Manage Content</h2>
                </div>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-grow"> {/* Added flex-grow */}
                  Update product listings, organize categories, and maintain your website's menu.
                </p>
                
                <div className="bg-white rounded-lg mt-auto"> {/* mt-auto to push links to bottom */}
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Core Management</h3>
                  <ul className="space-y-2.5"> {/* Slightly reduced space for denser look */}
                    <li>
                      <Link
                        href="/admin/products"
                        className="flex items-center text-base text-slate-600 hover:text-sky-700 hover:bg-sky-50 p-3 rounded-lg transition-all duration-200 group border border-slate-200 hover:border-sky-300"
                      >
                        <span className="flex items-center w-full">
                          <FiBox className="mr-3 text-lg text-sky-500 group-hover:rotate-[-5deg] transition-transform" />
                          Manage Products
                          <span className="ml-auto text-xs text-slate-400 group-hover:text-sky-500 transition-colors">&rarr;</span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/categories"
                        className="flex items-center text-base text-slate-600 hover:text-sky-700 hover:bg-sky-50 p-3 rounded-lg transition-all duration-200 group border border-slate-200 hover:border-sky-300"
                      >
                         <span className="flex items-center w-full">
                          <FiGrid className="mr-3 text-lg text-sky-500 group-hover:rotate-[-5deg] transition-transform" />
                          Manage Categories
                          <span className="ml-auto text-xs text-slate-400 group-hover:text-sky-500 transition-colors">&rarr;</span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-white border-t border-slate-200 mt-10">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
            <p className="mt-1">Admin Panel v1.0</p>
          </div>
        </footer>
      </div>
    );
  }

  // Fallback for unauthenticated
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      <FiLogIn className="text-5xl text-red-500 mb-4" />
      <h1 className="text-2xl font-semibold text-slate-700 mb-2">Access Denied</h1>
      <p className="text-slate-600 mb-6 text-center">
        You need to be logged in to access the Admin Panel.
      </p>
      <Link
        href="/login"
        className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg text-base"
      >
        Go to Login
      </Link>
    </div>
  );
}