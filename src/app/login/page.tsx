"use client";

import Link from "next/link";
// Removed Button from "@/components/ui/button" as you are using a standard button element below.
// If you have a custom Button component you intend to use, you can re-add it and adjust.
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiLogIn, FiLoader } from 'react-icons/fi'; // Added icons for inputs and button

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleFormSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        setLoginInProgress(true);
        setError(null); // Clear previous errors

        try {
            const result = await signIn('credentials', {
                redirect: false, // Prevent automatic redirect
                email,
                password,
            });

            if (result?.error) {
                console.error('Login failed:', result.error);
                setError('Invalid email or password. Please try again.'); 
            } else if (result?.ok) { // Check for result.ok for success
                console.log('Login successful!');
                router.push('/admin'); 
            } else {
                // Handle other unknown states if necessary
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('An error occurred during sign-in:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoginInProgress(false);
        }
    }

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Optional: Logo or App Name */}
                {/* <div className="text-center mb-8">
                    <Link href="/" className="text-4xl font-bold text-sky-600">
                        YourAppName
                    </Link>
                </div> */}

                <div className="bg-white p-8 shadow-2xl rounded-xl space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-800">
                            Bakso Lebam
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Login Admin
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 p-3 rounded-md text-center">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                                    placeholder="you@example.com"
                                    value={email}
                                    disabled={loginInProgress}
                                    onChange={ev => setEmail(ev.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    disabled={loginInProgress}
                                    onChange={ev => setPassword(ev.target.value)}
                                />
                            </div>
                        </div>

                        {/* Remember me & Forgot password (Optional) */}
                        {/* <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-sky-600 hover:text-sky-500">Forgot your password?</a>
                            </div>
                        </div> */}

                        {/* Login Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={loginInProgress}
                            >
                                {loginInProgress ? (
                                    <>
                                        <FiLoader className="animate-spin h-5 w-5 mr-2" />
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        <FiLogIn className="h-5 w-5 mr-2" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Register Link */}
                    <div className="text-sm text-center text-slate-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <footer className="text-center text-sm text-slate-500 mt-8">
                &copy; {new Date().getFullYear()} Bakso Lebam. All rights reserved.
            </footer>
        </section>
    );
}