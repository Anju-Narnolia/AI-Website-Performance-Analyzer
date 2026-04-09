import { useState } from 'react';
import { useNavigate } from 'react-router';
export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: ''
    });
    const API_URL = import.meta.env.VITE_API_URL || "http://16.170.172.53:5000";
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log(data);
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
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center border border-gray-300  rounded-md  shadow-md">
                <h1 className="text-3xl font-bold py-10">Register Here</h1>
                <form className="  p-10 flex gap-4 flex-col w-full max-w-md">
                    <div>
                        <label className="text-gray-600" >User Name</label>
                        <input type="text"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full" />
                    </div>
                    <div>
                        <label className="text-gray-600" >Email  Address</label>
                        <input type="email"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full" />
                    </div>
                    <div>
                        <label className="text-gray-600" >Password</label>
                        <input type="password"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full" />
                    </div>
                    <div>
                        <label className="text-gray-600" >Confirm Password</label>
                        <input type="password"
                            onChange={(e) => {
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }}
                            className="border border-gray-300 rounded-md p-2 w-full" />
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-red-500">Passwords do not match</p>
                    )}
                    <div>
                        <label className="text-gray-600" >Company Name</label>
                        <input type="text" className="border border-gray-300 rounded-md p-2 w-full"
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                    </div>
                    <div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800"
                            onClick={handleRegister}>
                            Register
                        </button>
                    </div>
                    <label className="text-gray-600" >Already have an account? <a href="/login" className="text-blue-6000">Login here</a></label>
                </form>
            </div>
        </div>
    </>);
}