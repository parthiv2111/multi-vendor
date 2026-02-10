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
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-indigo-600" />
                    Your Shopping Cart
                </h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <section className="lg:col-span-7">
                        {cart?.items?.length > 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <ul role="list" className="divide-y divide-gray-200">
                                    {cart.items.map((item: any) => (
                                        <li key={item.id} className="p-6 flex gap-6">
                                            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.title}
                                                        className="w-full h-full object-center object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-300">No Img</div>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        <Link href={`/products/${item.product.id}`} className="hover:text-indigo-600 transition-colors">
                                                            {item.product.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-lg font-bold text-gray-900">${item.product.price}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
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
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                                <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                                <Link href="/" className="btn-primary inline-flex items-center">
                                    Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Order summary */}
                    {cart?.items?.length > 0 && (
                        <section className="mt-16 lg:mt-0 lg:col-span-5">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

                                <dl className="space-y-4">
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-base font-bold text-gray-900">Order Total</dt>
                                        <dd className="text-xl font-bold text-indigo-600">
                                            ${cart.items.reduce((acc: number, item: any) => acc + (parseFloat(item.product.price) * item.quantity), 0).toFixed(2)}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-8 space-y-4">
                                    <button
                                        onClick={checkout}
                                        className="w-full btn-primary flex justify-center py-4 text-lg shadow-xl shadow-indigo-500/20"
                                    >
                                        Checkout Securely
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full bg-white border border-gray-200 text-gray-600 rounded-xl py-3 font-medium hover:bg-gray-50 hover:text-red-500 transition-colors"
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
