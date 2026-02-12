'use client';

import Link from 'next/link';
import { Package, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) return null;

    return (
        <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-emerald-400/10 via-black to-black" />
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <span className="rounded-xl bg-emerald-400/20 p-2 ring-1 ring-emerald-400/30">
                                <Package className="h-6 w-6 text-emerald-300" />
                            </span>
                            <span className="text-xl font-bold text-white">MarketAI</span>
                        </Link>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                            The next-generation marketplace for buyers and vendors. Discover smarter deals,
                            verified sellers, and AI-driven recommendations.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                                AI Price Insights
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                                Verified Vendors
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                <Zap className="h-3.5 w-3.5 text-amber-300" />
                                Fast Checkout
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="grid gap-8 sm:grid-cols-3">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-white">Shop</p>
                                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                                    <li><Link href="/products" className="hover:text-emerald-300 transition-colors">Browse Products</Link></li>
                                    <li><Link href="/compare" className="hover:text-emerald-300 transition-colors">Compare Prices</Link></li>
                                    <li><Link href="/cart" className="hover:text-emerald-300 transition-colors">Your Cart</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-white">Vendors</p>
                                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                                    <li><Link href="/dashboard" className="hover:text-emerald-300 transition-colors">Vendor Dashboard</Link></li>
                                    <li><Link href="/register" className="hover:text-emerald-300 transition-colors">Start Selling</Link></li>
                                    <li><Link href="/login" className="hover:text-emerald-300 transition-colors">Vendor Sign In</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-white">Support</p>
                                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                                    <li><Link href="/" className="hover:text-emerald-300 transition-colors">Help Center</Link></li>
                                    <li><Link href="/" className="hover:text-emerald-300 transition-colors">Shipping</Link></li>
                                    <li><Link href="/" className="hover:text-emerald-300 transition-colors">Returns</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>Copyright 2026 MarketAI. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/" className="hover:text-emerald-300 transition-colors">Privacy</Link>
                        <Link href="/" className="hover:text-emerald-300 transition-colors">Terms</Link>
                        <Link href="/" className="hover:text-emerald-300 transition-colors">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
