'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Package, ShoppingCart, Store, TrendingUp, Users, Zap } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const { login, isLoading } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password, rememberMe);

        if (result.success) {
            router.push(result.redirectUrl || '/');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-slate-950">
            {/* Animated Marketplace Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 left-10 text-emerald-400/20 animate-blob animation-delay-150">
                    <ShoppingCart className="h-16 w-16" />
                </div>
                <div className="absolute top-20 right-20 text-cyan-400/20 animate-blob animation-delay-300">
                    <Store className="h-20 w-20" />
                </div>
                <div className="absolute bottom-20 left-20 text-teal-400/20 animate-blob animation-delay-450">
                    <Package className="h-18 w-18" />
                </div>
                <div className="absolute bottom-10 right-10 text-emerald-300/20 animate-blob animation-delay-600">
                    <TrendingUp className="h-14 w-14" />
                </div>
                <div className="absolute top-1/3 left-1/4 text-cyan-300/20 animate-blob animation-delay-2000">
                    <Users className="h-12 w-12" />
                </div>
                <div className="absolute top-2/3 right-1/3 text-emerald-300/20 animate-blob animation-delay-1500">
                    <Zap className="h-14 w-14" />
                </div>

                {/* Subtle Gradient Blobs */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-blob animation-delay-450"></div>
            </div>

            {/* Login Content */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-2xl shadow-lg shadow-emerald-500/30 mb-4 animate-fade-in-up animation-delay-150">
                        <Package className="h-8 w-8 text-black" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up animation-delay-300">Welcome Back</h2>
                    <p className="text-slate-400 animate-fade-in-up animation-delay-450">Sign in to your MarketAI account</p>
                </div>

                {/* Login Card */}
                <div className="bg-black/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 animate-fade-in-up animation-delay-600">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-200 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="animate-fade-in-up animation-delay-150">
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 bg-black/40 text-white placeholder-slate-500"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="animate-fade-in-up animation-delay-300">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 bg-black/40 text-white placeholder-slate-500"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center animate-fade-in-up animation-delay-375">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-800 text-emerald-400 focus:ring-emerald-400 cursor-pointer bg-black/40"
                            />
                            <label htmlFor="remember-me" className="ml-3 text-sm font-medium text-slate-300 cursor-pointer">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white py-3.5 rounded-xl font-bold hover:from-emerald-300 hover:to-cyan-300 transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-fade-in-up animation-delay-450"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2 animate-fade-in-up animation-delay-600">
                            <Link href="/register" className="font-medium text-cyan-300 hover:text-cyan-200 text-sm transition-colors">
                                Don't have an account? <span className="font-semibold">Create one</span>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Bottom Marketing Text */}
                <div className="text-center mt-8 animate-fade-in-up animation-delay-600">
                    <p className="text-slate-400 text-sm">
                        Join thousands of buyers and vendors on MarketAI
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-slate-500">
                            <Users className="h-4 w-4" />
                            <span className="text-xs">10K+ Users</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <Store className="h-4 w-4" />
                            <span className="text-xs">500+ Vendors</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <Package className="h-4 w-4" />
                            <span className="text-xs">50K+ Products</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
