"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function registerPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [creatingUser, setCreatingUser] = useState(false)
    const [userCreated, setUserCreated] = useState(false)
    const [errors, setErrors] = useState<Record<string, string> | null>(null)

    async function handleFormSubmit(ev: { preventDefault: () => void; }) {
        ev.preventDefault();
        setCreatingUser(true);
        setErrors(null); // Clear previous errors

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            setCreatingUser(false);
            return; // Stop the function if passwords don't match
        }

        try {
            const response = await fetch('api/register', {
                method: 'POST',
                body: JSON.stringify({email, password, confirmPassword}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Registration successful
                console.log('Registration successful!');
                setUserCreated(true); // Set userCreated state
                // You might want to redirect the user or show a success message
            } else {
                // Registration failed
                const errorData = await response.json();
                console.error('Registration failed:', response.status, errorData);
                // Display error message to the user (you might want to parse errorData)
                setErrors(errorData.errors || { general: errorData.message || 'Registration failed' }); // Assuming API returns errors object or message
            }
        } catch (error) {
            console.error('An error occurred during fetch:', error);
            setErrors({ general: 'An unexpected error occurred.' }); // Set a general error message
            // Handle network errors or other exceptions
        }
        setCreatingUser(false);
    }

    return (
        <section>
            <div className="justify-center">
                <h1>Register User</h1>
                {userCreated && (
                    <div className="text-green-500 text-center">
                        User created successfully!
                    </div>
                )}
                {errors && (
                    <div className="text-red-500 text-center">
                        {errors.general && <p>{errors.general}</p>}
                        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                        {/* Add more specific error messages here if needed */}
                    </div>
                )}
                <form onSubmit={handleFormSubmit}>
                    <div className="flex-col max-w-80 mx-3 gap-2">
                        <div className="grid mb-2 p-2">
                            <label className="text-gray-400 font-extralight text-xs">E-mail</label>
                            <input className="border rounded-2xl font-extralight" type="email" value={email}
                            disabled={creatingUser}
                            onChange={ev => setEmail(ev.target.value)}/>
                        </div>
                        <div className="grid mb-2 p-2">
                            <label className="text-gray-400 font-extralight text-xs">Password</label>
                            <input className="border rounded-2xl font-extralight" type="password" value={password}
                            onChange={ev => setPassword(ev.target.value)}/>
                        </div>
                        <div className="grid mb-2 p-2">
                            <label className="text-gray-400 font-extralight text-xs">Confirm Password</label>
                            <input className="border rounded-2xl font-extralight" type="password" value={confirmPassword}
                            onChange={ev => setConfirmPassword(ev.target.value)}/>
                        </div>

                        <Button className="bg-red-500 text-white rounded-2xl font-extralight"
                        type="submit" disabled={creatingUser}>Register</Button>
                    </div>
                </form>
            </div>
        </section>
    )

}