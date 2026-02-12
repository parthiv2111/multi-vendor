'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchCart();
    }, [isAuthenticated, router]);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/cart/');
            setCart(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            await api.post('/cart/clear/');
            fetchCart();
        } catch (e) {
            console.error(e);
        }
    };

    const checkout = async () => {
        try {
            await api.post('/orders/');
            alert('Order placed successfully!');
            fetchCart();
            router.push('/dashboard');
        } catch (e) {
            alert('Checkout failed');
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-28 flex justify-center items-center bg-gradient-to-br from-black via-zinc-900 to-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-slate-950 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-emerald-400" />
                    Your Shopping Cart
                </h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <section className="lg:col-span-7">
                        {cart?.items?.length > 0 ? (
                            <div className="bg-black/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                                <ul role="list" className="divide-y divide-white/10">
                                    {cart.items.map((item: any) => (
                                        <li key={item.id} className="p-6 flex gap-6">
                                            <div className="flex-shrink-0 w-24 h-24 bg-white/5 rounded-xl overflow-hidden border border-white/10">
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.title}
                                                        className="w-full h-full object-center object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-500">No Img</div>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-semibold text-white">
                                                        <Link href={`/products/${item.product.id}`} className="hover:text-emerald-300 transition-colors">
                                                            {item.product.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-lg font-bold text-white">${item.product.price}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="text-sm text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                                        Qty {item.quantity}
                                                    </div>
                                                    {/* Future: Add remove item button */}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-black/70 rounded-2xl shadow-2xl border border-white/10">
                                <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                                    <ShoppingBag className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Your cart is empty</h3>
                                <p className="text-slate-400 mb-6">Looks like you haven't added anything yet.</p>
                                <Link href="/" className="inline-flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-300 hover:to-cyan-300 transition-all">
                                    Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Order summary */}
                    {cart?.items?.length > 0 && (
                        <section className="mt-12 lg:mt-0 lg:col-span-5">
                            <div className="bg-black/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 lg:p-8">
                                <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>

                                <dl className="space-y-4">
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <dt className="text-base font-bold text-white">Order Total</dt>
                                        <dd className="text-xl font-bold text-emerald-300">
                                            ${cart.items.reduce((acc: number, item: any) => acc + (parseFloat(item.product.price) * item.quantity), 0).toFixed(2)}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-8 space-y-4">
                                    <button
                                        onClick={checkout}
                                        className="w-full flex justify-center py-4 text-lg rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-bold shadow-xl shadow-emerald-500/20 hover:from-emerald-300 hover:to-cyan-300 transition-all"
                                    >
                                        Checkout Securely
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full bg-black/40 border border-white/10 text-slate-300 rounded-xl py-3 font-medium hover:bg-white/5 hover:text-rose-300 transition-colors"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
