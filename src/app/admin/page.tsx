'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiBox, FiGrid, FiShoppingCart, FiLogIn, FiLoader, FiUser } from 'react-icons/fi'; // Example icons

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
                {/* You could add a logout button here */}
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
                {/* TODO: Implement fetching and displaying orders here */}
                <div className="bg-slate-50 p-4 rounded-md text-sm text-slate-500">
                  <p className="italic">Order management functionality coming soon.</p>
                  {/* Example:
                  <ul className="mt-2 space-y-1">
                    <li>Order #123 - <span className="font-semibold text-yellow-600">Pending</span></li>
                    <li>Order #124 - <span className="font-semibold text-green-600">Completed</span></li>
                  </ul> */}
                </div>
                <Link href="/admin/orders">
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
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/admin/products"
                      className="flex items-center text-lg text-slate-700 hover:text-sky-600 hover:bg-sky-50 p-3 rounded-md transition-all duration-200 group"
                      legacyBehavior>
                      <FiBox className="mr-3 text-xl text-sky-500 group-hover:animate-pulse" />
                      Manage Products
                      <span className="ml-auto text-sm text-slate-400 group-hover:text-sky-500 transition-colors">&rarr;</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/categories"
                      className="flex items-center text-lg text-slate-700 hover:text-sky-600 hover:bg-sky-50 p-3 rounded-md transition-all duration-200 group"
                      legacyBehavior>
                      <FiGrid className="mr-3 text-xl text-sky-500 group-hover:animate-pulse" />
                      Manage Categories
                      <span className="ml-auto text-sm text-slate-400 group-hover:text-sky-500 transition-colors">&rarr;</span>
                    </Link>
                  </li>
                  {/* Add more management links as needed */}
                   {/* Example: Manage Users */}
                   {/*
                   <li>
                    <Link
                      href="/admin/users"
                      className="flex items-center text-lg text-slate-700 hover:text-sky-600 hover:bg-sky-50 p-3 rounded-md transition-all duration-200 group"
                    >
                      <FiUser className="mr-3 text-xl text-sky-500 group-hover:animate-pulse" />
                      Manage Users
                      <span className="ml-auto text-sm text-slate-400 group-hover:text-sky-500 transition-colors">&rarr;</span>
                    </Link>
                  </li>
                  */}
                </ul>
              </div>

              {/* You can add more cards here for other admin functionalities */}
              {/* Example: Site Settings Card */}
              {/*
              <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <FiSettings className="text-3xl text-teal-500 mr-3" />
                  <h2 className="text-2xl font-semibold text-slate-700">Site Settings</h2>
                </div>
                <p className="text-slate-600 mb-4">
                  Configure global settings for the application.
                </p>
                <Link
                  href="/admin/settings"
                  className="mt-6 inline-block text-teal-600 hover:text-teal-700 font-medium group transition-colors"
                >
                  Go to Settings
                  <span className="ml-1 inline-block transform group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                </Link>
              </div>
              */}

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

  // Fallback for unauthenticated (should be caught by useEffect, but good for safety)
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