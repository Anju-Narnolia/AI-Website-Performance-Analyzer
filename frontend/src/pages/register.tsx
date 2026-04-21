import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: ''
    });
    const API_URL = import.meta.env.VITE_API_URL || "http://16.170.172.53:3000";

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            } else {
                console.log('Registration successful');
            }
            localStorage.setItem('token', data.token);
            navigate("/login");

        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (<>
        <div className="bg-slate-950 flex items-center justify-center min-h-screen px-4">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-purple-500/20 p-10 rounded-2xl blur-3xl" />
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                    {/* Heading */}
                    <h1 className="text-white font-bold text-3xl text-center mb-6">
                        Create
                        <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {" "}your account
                        </span>
                    </h1>
                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        <div>
                            <label className="text-lg font-medium text-slate-300" >User Name</label>
                            <input type="text"
                                placeholder='Enter your Full Name'
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 w-full p-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required />
                        </div>
                        <div>
                            <label className="text-lg font-medium text-slate-300" >Email  Address</label>
                            <input type="email"
                                placeholder='Enter your Email'
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 w-full p-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required />
                        </div>
                        <div>
                            <label
                                className="text-lg font-medium text-slate-300" >
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder='Enter your Password'
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1 w-full p-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required />
                        </div>
                        <div>
                            <label
                                className="text-lg font-medium text-slate-300">
                                Company Name
                            </label>
                            <input
                                type="text"
                                placeholder='Enter Company Name'
                                className="mt-1 w-full p-3 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>
                        <button type="submit" className=" cursor-pointer bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-700 hover:to-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-800"
                            onClick={handleRegister}>
                            Register
                        </button>
                        <p className="text-center text-sm text-slate-400 " >Already have an account? <Link to="/login" className="text-blue-6000">
                            <span className="text-cyan-400 hover:underline">Login here</span>
                        </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </>);
}