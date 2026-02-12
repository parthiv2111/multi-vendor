'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { ShoppingCart, User, LogOut, Package, Menu, X, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

export default function Navbar() {
    const { user, isAuthenticated, logout, initializeAuth, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initialize auth on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const fetchCartCount = async () => {
        if (!isAuthenticated) {
            setCartCount(0);
            return;
        }

        try {
            const { data } = await api.get('/cart/');
            const totalCount = Array.isArray(data?.items)
                ? data.items.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0)
                : 0;
            setCartCount(totalCount);
        } catch (error) {
            setCartCount(0);
        }
    };

    // Show success message from URL params
    useEffect(() => {
        const messageParam = searchParams.get('message');
        if (messageParam) {
            setMessage(messageParam);
            setShowMessage(true);
            // Remove message from URL
            const newUrl = pathname;
            router.replace(newUrl, { scroll: false });
            // Hide message after 5 seconds
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [searchParams, pathname, router]);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        fetchCartCount();
    }, [isAuthenticated, pathname]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const openLoginModal = () => {
        setShowLoginModal(true);
        setShowRegisterModal(false);
    };

    const openRegisterModal = () => {
        setShowRegisterModal(true);
        setShowLoginModal(false);
    };

    const closeModals = () => {
        setShowLoginModal(false);
        setShowRegisterModal(false);
    };

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (isAuthPage) return null;

    // Dynamic styles for transparency on top of hero
    const isHomePage = pathname === '/';
    const isTransparent = isHomePage && !scrolled && !mobileMenuOpen;

    // Text colors based on background
    const textColor = isTransparent ? "text-white/90" : "text-slate-200";
    const hoverColor = isTransparent ? "hover:text-white" : "hover:text-emerald-300";
    const logoColor = isTransparent ? "text-white" : "text-emerald-400";
    const logoBg = isTransparent ? "bg-white/20 backdrop-blur-md" : "bg-emerald-400";
    const logoIconColor = isTransparent ? "text-white" : "text-white";
    const navBorder = isTransparent ? "border-transparent" : "border-white/10";

    return (
        <>
            {/* Success Message */}
            {showMessage && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in-up">
                    {message}
                </div>
            )}

            {/* Modals */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={closeModals}
                onSwitchToRegister={switchToRegister}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={closeModals}
                onSwitchToLogin={switchToLogin}
            />

            <nav className={twMerge(
                "fixed top-0 w-full z-40 transition-all duration-300 border-b",
                isTransparent
                    ? "bg-transparent border-transparent py-4"
                    : "bg-black/70 backdrop-blur-xl border-white/10 shadow-sm py-2"
            )}>
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center transition-all duration-300 h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                                <div className={twMerge(
                                    "p-2 rounded-xl transition-all duration-300",
                                    logoBg,
                                    !isTransparent && "shadow-lg shadow-emerald-500/20"
                                )}>
                                    <Package className={twMerge("h-6 w-6", logoIconColor)} suppressHydrationWarning />
                                </div>
                                <span className={twMerge(
                                    "text-2xl font-bold tracking-tight transition-colors duration-300",
                                    isTransparent ? "text-white" : "bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300"
                                )}>
                                    MarketAI
                                </span>
                            </Link>

                            {/* Desktop Nav */}
                            <div className="hidden md:ml-12 md:flex md:space-x-8">
                                <NavLink href="/products" active={pathname === '/products'} isTransparent={isTransparent}>Products</NavLink>
                                <NavLink href="/compare" active={pathname === '/compare'} isTransparent={isTransparent}>Compare</NavLink>
                                {user?.role === 'SELLER' && (
                                    <NavLink href="/dashboard" active={pathname === '/dashboard'} isTransparent={isTransparent}>Dashboard</NavLink>
                                )}
                            </div>
                        </div>

                        {/* Right Side Actions (Desktop) */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/cart" className={twMerge(
                                "relative group transition-colors duration-200",
                                textColor, hoverColor
                            )}>
                                <ShoppingCart className="h-6 w-6" suppressHydrationWarning />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 min-w-4 px-1 flex items-center justify-center rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <div className={twMerge(
                                        "flex items-center space-x-3 pl-4 border-l transition-colors duration-300",
                                        isTransparent ? "border-white/20" : "border-white/10"
                                    )}>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold text-sm shadow-md ring-2 ring-white/20">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={twMerge("text-sm font-medium", textColor)}>{user?.username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className={twMerge(
                                            "transition-colors p-2 rounded-full",
                                            isTransparent ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-slate-400 hover:text-rose-300 hover:bg-rose-500/10"
                                        )}
                                        title="Log out"
                                    >
                                        <LogOut className="h-5 w-5" suppressHydrationWarning />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={openLoginModal}
                                        className={twMerge(
                                            "text-sm font-bold transition-colors px-4 py-2 rounded-lg",
                                            isTransparent
                                                ? "text-white hover:bg-white/10"
                                                : "text-slate-200 hover:bg-white/5"
                                        )}
                                    >
                                        Log in
                                    </button>
                                    <button
                                        onClick={openRegisterModal}
                                        className={twMerge(
                                            "text-sm font-bold transition-colors px-4 py-2 rounded-lg",
                                            isTransparent
                                                ? "text-white hover:bg-white/10"
                                                : "text-slate-200 hover:bg-white/5"
                                        )}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden gap-4">
                            <Link href="/cart" className={twMerge("relative", textColor)}>
                                <ShoppingCart className="h-6 w-6" suppressHydrationWarning />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 min-w-4 px-1 flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={twMerge(
                                    "p-2 rounded-xl transition-colors",
                                    isTransparent ? "text-white hover:bg-white/10" : "text-slate-200 hover:bg-white/5"
                                )}
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-6 w-6" suppressHydrationWarning />
                                ) : (
                                    <Menu className="h-6 w-6" suppressHydrationWarning />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={twMerge(
                "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300",
                mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )} onClick={() => setMobileMenuOpen(false)} />

            {/* Mobile Menu Drawer */}
            <div className={twMerge(
                "fixed top-0 right-0 z-30 w-[85%] max-w-sm h-full bg-black/90 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col border-l border-white/10",
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/70">
                    <span className="text-xl font-bold text-white">Menu</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
                        <X className="h-5 w-5" suppressHydrationWarning />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <MobileNavLink href="/products">Products</MobileNavLink>
                    <MobileNavLink href="/compare">Compare Prices</MobileNavLink>
                    {user?.role === 'SELLER' && (
                        <MobileNavLink href="/dashboard">Vendor Dashboard</MobileNavLink>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 bg-black/70">
                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-black/60 border border-white/10 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{user?.username}</p>
                                    <p className="text-xs text-slate-500">View Profile</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 bg-black/60 border border-rose-500/30 text-rose-300 py-3 rounded-xl font-medium hover:bg-rose-500/10 transition-colors shadow-sm"
                            >
                                <LogOut className="h-4 w-4" suppressHydrationWarning />
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={openLoginModal}
                                className="w-full flex justify-center items-center py-3 rounded-xl border border-white/10 text-slate-200 font-bold hover:bg-white/5 transition-colors"
                            >
                                Log in
                            </button>
                            <button
                                onClick={openRegisterModal}
                                className="w-full flex justify-center items-center py-3 rounded-xl border border-white/10 text-slate-200 font-bold hover:bg-white/5 transition-colors"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function NavLink({ href, active, children, isTransparent }: { href: string; active: boolean; children: React.ReactNode, isTransparent: boolean }) {

    // Base classes
    const baseClasses = "inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-200 border-b-2";

    // Active state styles
    let activeClasses = "";
    if (active) {
        activeClasses = isTransparent
            ? "border-white text-white"
            : "border-emerald-400 text-emerald-300";
    } else {
        activeClasses = isTransparent
            ? "border-transparent text-white/70 hover:text-white hover:border-white/30"
            : "border-transparent text-slate-400 hover:text-white hover:border-white/20";
    }

    return (
        <Link
            href={href}
            className={twMerge(baseClasses, activeClasses)}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between p-4 rounded-xl text-slate-300 hover:bg-white/5 hover:text-emerald-300 transition-all duration-200 group font-medium"
        >
            <span className="text-lg">{children}</span>
            <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-300" suppressHydrationWarning />
        </Link>
    );
}
