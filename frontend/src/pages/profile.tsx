import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Building2,
    Calendar,
    Edit2,
    Save,
    X,
    Lock,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    companyName: string;
    createdAt: string;
}

interface Toast {
    type: 'success' | 'error';
    message: string;
}

export default function Profile() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<Toast | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        password: '',
        confirmPassword: '',
    });

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const res = await fetch(`${API_URL}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to fetch profile');
                }

                const data = await res.json();
                setProfile(data);
                setFormData({
                    name: data.name,
                    companyName: data.companyName,
                    password: '',
                    confirmPassword: '',
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [API_URL, navigate]);

    const showToast = useCallback((type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const validateForm = () => {
        if (!formData.name.trim() || formData.name.length < 2) {
            showToast('error', 'Name must be at least 2 characters');
            return false;
        }

        if (!formData.companyName.trim()) {
            showToast('error', 'Company name is required');
            return false;
        }

        if (formData.password) {
            if (formData.password.length < 6) {
                showToast('error', 'Password must be at least 6 characters');
                return false;
            }

            if (formData.password !== formData.confirmPassword) {
                showToast('error', 'Passwords do not match');
                return false;
            }
        }

        return true;
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');

            const updateData: { name: string; companyName: string; password?: string } = {
                name: formData.name,
                companyName: formData.companyName,
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            const res = await fetch(`${API_URL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await res.json();
            setProfile(data.user);
            setFormData((prev) => ({
                ...prev,
                password: '',
                confirmPassword: '',
            }));
            setIsEditing(false);
            showToast('success', 'Profile updated successfully!');
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-300">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4">
            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg flex items-center gap-3 animate-slide-in-right ${toast.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                        }`}
                >
                    {toast.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mt-14">My Profile</h1>
                    <p className="text-slate-400">Manage your account settings and preferences</p>
                </div>

                {/* Profile Card */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-linear-to-r from-cyan-500/10 to-purple-500/10 p-8 border-b border-slate-700/50">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-linear-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                                <p className="text-slate-400">{profile?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        {!isEditing ? (
                            // View Mode
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4" />
                                            Full Name
                                        </label>
                                        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                            <p className="text-white font-medium">{profile?.name}</p>
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4" />
                                            Company Name
                                        </label>
                                        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                            <p className="text-white font-medium">{profile?.companyName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                        <p className="text-white font-medium">{profile?.email}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Email cannot be changed for security reasons
                                    </p>
                                </div>

                                {/* Joined Date */}
                                <div>
                                    <label className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        Account Created
                                    </label>
                                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                        <p className="text-white font-medium">
                                            {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div>
                                        <label className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    {/* Company Field */}
                                    <div>
                                        <label className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4" />
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, companyName: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                            placeholder="Enter company name"
                                        />
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="pt-4 border-t border-slate-700/30">
                                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
                                        <Lock className="w-4 h-4" />
                                        Change Password (Optional)
                                    </h3>

                                    <div className="space-y-4">
                                        {/* New Password */}
                                        <div>
                                            <label className="text-sm text-slate-400 mb-2 block">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, password: e.target.value })
                                                }
                                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                placeholder="Leave blank to keep current password"
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="text-sm text-slate-400 mb-2 block">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        confirmPassword: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-green-500/25 disabled:opacity-70"
                                    >
                                        <Save className="w-5 h-5" />
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: profile?.name || '',
                                                companyName: profile?.companyName || '',
                                                password: '',
                                                confirmPassword: '',
                                            }));
                                        }}
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 disabled:bg-slate-700/30 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-600/50 disabled:opacity-70"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
