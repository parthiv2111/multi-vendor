'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { ShoppingBag, Heart, Settings, Package, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export const dynamic = 'force-dynamic';

export default function CustomerDashboardPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('orders'); // orders, cart, favorites, settings

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user?.role !== 'BUYER') {
            router.push('/');
            return;
        }
        fetchOrders();
        fetchCart();
        fetchFavorites();
    }, [isAuthenticated, user, router]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/');
            setOrders(data.results || data);
        } catch (e) {
            console.error('Failed to fetch orders:', e);
        }
    };

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/cart/');
            setCartItems(data.items || []);
        } catch (e) {
            console.error('Failed to fetch cart:', e);
        }
    };

    const fetchFavorites = async () => {
        try {
            const { data } = await api.get('/favorites/');
            setFavorites(data.results || data);
        } catch (e) {
            console.error('Failed to fetch favorites:', e);
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            await api.delete(`/cart/${itemId}/`);
            fetchCart();
        } catch (e) {
            console.error('Failed to remove item:', e);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full pt-20">
                <div className="px-6 py-4">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">My Account</h2>
                    <nav className="space-y-1">
                        <SidebarLink icon={Package} label="My Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                        <SidebarLink icon={ShoppingBag} label="Shopping Cart" active={activeTab === 'cart'} onClick={() => setActiveTab('cart')} />
                        <SidebarLink icon={Heart} label="Favorites" active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
                        <SidebarLink icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-24">
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                                <p className="text-gray-600 mt-1">Track and manage your orders</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <ul className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <li key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <Clock className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Order #{order.id}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">${order.total}</p>
                                                    <span className={clsx(
                                                        "text-xs font-medium px-3 py-1 rounded-full",
                                                        order.status === 'completed' ? "bg-green-100 text-green-800" :
                                                            order.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                                                                "bg-gray-100 text-gray-800"
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {orders.length === 0 && (
                                        <li className="p-8 text-center text-gray-500">No orders yet. Start shopping!</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'cart' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                                <p className="text-gray-600 mt-1">Review and manage items in your cart</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <ul className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-lg bg-gray-100 flex-shrink-0">
                                                    {item.product?.image && (
                                                        <img src={item.product.image} className="h-full w-full object-cover rounded-lg" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.product?.title}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity: {item.quantity} × ${item.product?.price}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                    {cartItems.length === 0 && (
                                        <li className="p-8 text-center text-gray-500">Your cart is empty</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Favorite Products</h1>
                                <p className="text-gray-600 mt-1">Your saved items for later</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favorites.map((product) => (
                                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                        <div className="h-40 rounded-lg bg-gray-100 mb-4">
                                            {product.image && (
                                                <img src={product.image} className="h-full w-full object-cover rounded-lg" />
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                                        <p className="text-lg font-bold text-emerald-600">${product.price}</p>
                                    </div>
                                ))}
                                {favorites.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                        No favorite items yet
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                                <p className="text-gray-600 mt-1">Manage your account preferences</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Account Information</h3>
                                        <p className="text-sm text-gray-600">Email: {user?.email}</p>
                                        <p className="text-sm text-gray-600">Username: {user?.username}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Preferences</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" defaultChecked className="rounded" />
                                            <span className="ml-3 text-gray-700">Email notifications</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" defaultChecked className="rounded" />
                                            <span className="ml-3 text-gray-700">SMS notifications</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ icon: Icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors mb-1",
                active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
        >
            <Icon className="mr-3 h-5 w-5" />
            {label}
        </button>
    );
}
