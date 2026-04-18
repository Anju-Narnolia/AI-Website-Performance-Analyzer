import { Menu, X, Zap, User, } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropDown, SetDropDown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const { user } = useAuth();
    const { logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                SetDropDown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            SetDropDown(false); // optional: close on scroll
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: 'Dashboard', href: '/' },
        { name: 'Analytics', href: '/analyze' },
        { name: 'History', href: '/history' },
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
                        <div className="hidden md:flex items-center gap-4 relative" ref={dropdownRef}>
                            {/* User Button */}
                            <button
                                onClick={() => SetDropDown(!isDropDown)}
                                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
                            >
                                <User className="w-4 h-4" />
                            </button>

                            {/* Dropdown */}
                            {isDropDown && (
                                <div className="absolute top-10 -left-10 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-lg shadow-black/30 z-50">
                                    <Link to="/profile">
                                        <button className="cursor-pointer w-full text-left px-4 py-2 hover:bg-slate-500 text-white text-sm rounded-t-xl">
                                            Profile
                                        </button>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer w-full text-left px-4 py-2 hover:bg-red-600 text-white text-sm rounded-b-xl"
                                    >
                                        Logout
                                    </button>

                                </div>
                            )}
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

            {/* Mobile view  Menu */}
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
                        {user && (
                            <>
                                <Link to="/profile" className="block text-slate-300 hover:text-white py-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full mt-4 px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg">
                                    Logout
                                </button>
                            </>
                        )}
                        {!user && (
                            <Link to="/register" className="w-full mt-4 px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg block text-center">
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};