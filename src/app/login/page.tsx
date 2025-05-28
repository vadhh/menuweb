"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
                // Handle login errors (e.g., invalid credentials)
                console.error('Login failed:', result.error);
                setError('Invalid email or password.'); // Generic error message for security
            } else {
                // Login successful
                console.log('Login successful!');
                // Redirect to the home page or a dashboard
                router.push('/admin'); // Or wherever you want to redirect after login
            }
        } catch (err) {
            console.error('An error occurred during sign-in:', err);
            setError('An unexpected error occurred.');
        } finally {
            setLoginInProgress(false);
        }
    }

    return (
        <section>
            <div className="justify-center">
                <h1>Login</h1>
                {error && (
                    <div className="text-red-500 text-center">
                        <p>{error}</p>
                    </div>
                )}
                <form onSubmit={handleFormSubmit}>
                    <div className="flex-col max-w-80 mx-3 gap-2">
                        <div className="grid mb-2 p-2">
                            <label className="text-gray-400 font-extralight text-xs">E-mail</label>
                            <input
                                className="border rounded-2xl font-extralight"
                                type="email"
                                value={email}
                                disabled={loginInProgress}
                                onChange={ev => setEmail(ev.target.value)}
                            />
                        </div>
                        <div className="grid mb-2 p-2">
                            <label className="text-gray-400 font-extralight text-xs">Password</label>
                            <input
                                className="border rounded-2xl font-extralight"
                                type="password"
                                value={password}
                                disabled={loginInProgress}
                                onChange={ev => setPassword(ev.target.value)}
                            />
                        </div>

                        <Button
                            className="bg-red-500 text-white rounded-2xl font-extralight"
                            type="submit"
                            disabled={loginInProgress}
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}