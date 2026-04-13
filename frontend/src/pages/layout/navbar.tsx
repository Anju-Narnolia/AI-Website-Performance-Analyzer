import { Menu, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const { logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Analytics', href: '/analyze' },
        { name: 'Dashboard', href: '/dashboard' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        window.location.href = '/login';
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <Link to="/" className="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            <span className="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                WebOpt AI
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {!user && (
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/login">
                                <button className="cursor-pointer text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                    Sign In
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-4 py-2 bg-linear-to-r cursor-pointer from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    )}
                    {user && (
                        <div className="hidden md:flex items-center gap-4">

                            <Link to="/dashboard">
                                <button className="px-4 py-2 bg-linear-to-r cursor-pointer from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25">
                                    My Profile
                                </button>
                            </Link>
                            <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r cursor-pointer from-red-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25">
                                Logout
                            </button>
                        </div>

                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-300 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="block text-slate-300 hover:text-white py-2 text-sm font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/register" className="w-full mt-4 px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg">
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};