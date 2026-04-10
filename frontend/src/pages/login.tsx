import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;
    const { login } = useAuth();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            } else {
                console.log('Login successful');
            }
            localStorage.setItem('token', data.token);
            login({ token: data.token, user: data.user });
            navigate("/dashboard");

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="bg-slate-950 flex items-center justify-center min-h-screen px-4">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-purple-500/20 p-10 rounded-2xl blur-3xl" />
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                    {/* Heading */}
                    <h1 className="text-white font-bold text-3xl text-center mb-6">
                        Login
                        <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {" "}to your account
                        </span>
                    </h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-lg font-medium text-slate-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="mt-1 w-full p-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-medium text-slate-300">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="mt-1 w-full p-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-400 mt-4">
                        Don't have an account?{" "}
                        <Link to="/register">
                            <span className="text-cyan-400 cursor-pointer hover:underline">
                                Sign up
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}