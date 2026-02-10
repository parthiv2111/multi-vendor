'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (isAuthPage) return null;

    return (
        <nav className={twMerge(
            "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
            scrolled ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <Package className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                MarketAI
                            </span>
                        </Link>
                        {/* Desktop Nav */}
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <NavLink href="/products" active={pathname === '/products'}>Products</NavLink>
                            <NavLink href="/compare" active={pathname === '/compare'}>Compare</NavLink>
                            {user?.role === 'SELLER' && (
                                <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
                            )}
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-6">
                        <Link href="/cart" className="relative group text-gray-500 hover:text-indigo-600 transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                                {/* Cart count mock */} 2
                            </span>
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={twMerge(
                "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors border-b-2",
                active
                    ? "border-indigo-600 text-indigo-900"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            )}
        >
            {children}
        </Link>
    );
}
