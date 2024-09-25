'use client';

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
    const auth = getAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const emailValidation = !email.trim();
    const passwordValidation = !password.trim();

    const formValidation = emailValidation || passwordValidation;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);

            toast.success("Login effettuato con successo!", {
                className: "bg-green-500 text-white p-2 rounded-lg",
              });

            // Reindirizza alla home 
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (error) {
            setLoading(false);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h1>
                {error && (
                    <div className="mb-4 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 rounded">
                        <strong className="font-semibold">Error:</strong>
                        <p>{error}</p>
                    </div>
                )}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className={`bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors duration-300 ${formValidation || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={formValidation || loading}
                        type="submit"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </div>
            <ToastContainer containerId="toastSignIn"/>
        </div>
    );
}
