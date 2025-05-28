'use client';

import { useSession, signOut } from 'next-auth/react'; // signOut imported
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
    FiShoppingCart, 
    FiLogIn, 
    FiLoader, 
    FiUser, 
    FiBox, 
    FiGrid, 
    FiLogOut, // FiLogOut is already imported
    FiChevronLeft // ChevronLeft was used in a button, ensure it's kept if other buttons use it
} from 'react-icons/fi'; 
import { Button } from '@/components/ui/button'; // Assuming Button is used elsewhere or for consistency
import { AlertTriangle } from 'lucide-react'; // From error display

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
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
                <Link href="/admin" className="flex-shrink-0 text-2xl font-bold text-sky-600 hover:text-sky-700 transition-colors">
                  Admin Dashboard
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 hidden sm:block">
                  Welcome, <span className="font-medium">{session.user?.name || session.user?.email}</span>!
                </span>
                {/* New Logout Button Location */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center text-sm text-slate-600 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  title="Logout"
                >
                  <FiLogOut className="h-5 w-5 sm:mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Message for smaller screens */}
            <div className="sm:hidden mb-6 text-center">
              <p className="text-lg text-slate-700">
                Welcome, <span className="font-semibold">{session.user?.name || session.user?.email}</span>!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Orders Section Card */}
              <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <FiShoppingCart className="text-3xl text-sky-500 mr-3" />
                  <h2 className="text-2xl font-semibold text-slate-700">Orders</h2>
                </div>
                <p className="text-slate-600 mb-4">
                  View and manage customer orders.
                </p>
                <div className="bg-slate-50 p-4 rounded-md text-sm text-slate-500">
                  <p className="italic">Order management functionality coming soon.</p>
                </div>
                <Link href="/admin/orders">
                  {/* This Link usage is correct (single child span) */}
                  <span className="mt-6 inline-block text-sky-600 hover:text-sky-700 font-medium group transition-colors">
                    View All Orders
                    <span className="ml-1 inline-block transform group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                  </span>
                </Link>
              </div>

              {/* Manage Content Card */}
              <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <FiGrid className="text-3xl text-purple-500 mr-3" />
                  <h2 className="text-2xl font-semibold text-slate-700">Manage Content</h2>
                </div>
                <p className="text-slate-600 mb-4">
                  Update product listings and organize categories.
                </p>
                {/* The h1 "Admin Dashboard" was duplicated here, removing it as it's in the header */}
                {/* <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Dashboard</h1> */}

                <div className="grid grid-cols-1"> {/* Adjusted grid for this card as it's one column of items */}
                  <div className="bg-white p-0 sm:p-6 rounded-lg"> {/* Removed shadow-md if it's already on parent card, adjusted padding for mobile */}
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Management</h2>
                    <ul className="space-y-3">
                      <li>
                        {/* This Link will cause "Multiple children" error. Needs wrapper. */}
                        <Link
                          href="/admin/products"
                          className="flex items-center text-lg text-slate-700 hover:text-sky-600 hover:bg-sky-50 p-3 rounded-md transition-all duration-200 group"
                        >
                          <span className="flex items-center w-full"> {/* Wrapper for multiple children */}
                            <FiBox className="mr-3 text-xl text-sky-500 group-hover:animate-pulse" />
                            Manage Products
                            <span className="ml-auto text-sm text-slate-400 group-hover:text-sky-500 transition-colors">&rarr;</span>
                          </span>
                        </Link>
                      </li>
                      <li>
                        {/* This Link will also cause "Multiple children" error. Needs wrapper. */}
                        <Link
                          href="/admin/categories"
                          className="flex items-center text-lg text-slate-700 hover:text-sky-600 hover:bg-sky-50 p-3 rounded-md transition-all duration-200 group"
                        >
                           <span className="flex items-center w-full"> {/* Wrapper for multiple children */}
                            <FiGrid className="mr-3 text-xl text-sky-500 group-hover:animate-pulse" />
                            Manage Categories
                            <span className="ml-auto text-sm text-slate-400 group-hover:text-sky-500 transition-colors">&rarr;</span>
                          </span>
                        </Link>
                      </li>
                      {/* Logout button was here, now moved to header */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
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
        className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
      >
        Go to Login
      </Link>
    </div>
  );
}