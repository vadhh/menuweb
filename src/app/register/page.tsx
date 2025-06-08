"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming this is your Shadcn/ui or custom Button
import { useState, useEffect } from "react"; // Added useEffect for potential redirect on success
import { useRouter } from "next/navigation"; // For redirecting
import { FiMail, FiLock, FiUserPlus, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'; // Icons

export default function RegisterPage() { // Renamed to follow PascalCase convention for components
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [errors, setErrors] = useState<Record<string, string> | null>(null);
    const router = useRouter();

    async function handleFormSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        setCreatingUser(true);
        setErrors(null);
        setUserCreated(false); // Reset userCreated state on new submission

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match. Please re-enter.' });
            setCreatingUser(false);
            return;
        }

        // Basic password length validation (example)
        if (password.length < 6) {
            setErrors({ password: 'Password must be at least 6 characters long.' });
            setCreatingUser(false);
            return;
        }

        try {
            const response = await fetch('/api/register', { // Corrected API path
                method: 'POST',
                body: JSON.stringify({ email, password }), // Only send email and password
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json(); // Always try to parse JSON

            if (response.ok) {
                console.log('Registration successful!', responseData);
                setUserCreated(true);
                // Optional: Redirect after a short delay or immediately
                // setTimeout(() => router.push('/login'), 2000); 
            } else {
                console.error('Registration failed:', response.status, responseData);
                setErrors(responseData.errors || { general: responseData.message || 'Registration failed. Please try again.' });
            }
        } catch (error) {
            console.error('An error occurred during fetch:', error);
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        }
        setCreatingUser(false);
    }

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 shadow-2xl rounded-xl space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-800">
                            Create Your Account
                        </h1>
                    </div>

                    {userCreated && (
                        <div className="bg-green-50 p-4 rounded-md text-center">
                            <FiCheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-green-700">
                                Account created successfully!
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                You can now log in with your new credentials.
                            </p>
                            <Link href="/login" className="mt-3 inline-block text-sm font-medium text-sky-600 hover:text-sky-500 hover:underline">
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {errors && !userCreated && (
                        <div className="bg-red-50 p-3 rounded-md text-sm text-red-600 space-y-1 text-center">
                            <FiAlertCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
                            {errors.general && <p>{errors.general}</p>}
                            {errors.email && <p>{errors.email}</p>}
                            {errors.password && <p>{errors.password}</p>}
                            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                        </div>
                    )}

                    {!userCreated && ( // Hide form if user has been created
                        <form className="space-y-5" onSubmit={handleFormSubmit}>
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
                                        disabled={creatingUser}
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
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                                        placeholder="Create a password (min. 6 chars)"
                                        value={password}
                                        disabled={creatingUser}
                                        onChange={ev => setPassword(ev.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        disabled={creatingUser}
                                        onChange={ev => setConfirmPassword(ev.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {/* Register Button */}
                            <div>
                                <Button // Using your Button component
                                    type="submit"
                                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={creatingUser}
                                >
                                    {creatingUser ? (
                                        <>
                                            <FiLoader className="animate-spin h-5 w-5 mr-2" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <FiUserPlus className="h-5 w-5 mr-2" />
                                            Create Account
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Login Link */}
                    {!userCreated && (
                        <div className="text-sm text-center text-slate-600 pt-4">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <footer className="text-center text-sm text-slate-500 mt-8">
                &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </footer>
        </section>
    );
}