'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { Plus, Package, DollarSign, BarChart2, Settings, TrendingUp, ShoppingCart, Award } from 'lucide-react';
import { clsx } from 'clsx';

export const dynamic = 'force-dynamic';

export default function VendorDashboardPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('products'); // products, add_product, analytics, earnings, settings
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [vendor, setVendor] = useState<any>(null);

    // Add Product Form State
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<any[]>([]);

    // Settings Form State
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [settingsLoading, setSettingsLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user?.role !== 'SELLER') {
            router.push('/');
            return;
        }
        fetchMyProducts();
        fetchCategories();
        fetchAnalytics();
        fetchVendorProfile();
    }, [isAuthenticated, user, router]);

    const fetchVendorProfile = async () => {
        try {
            const { data } = await api.get('/vendors/me/');
            setVendor(data);
            setStoreName(data.store_name);
            setStoreDescription(data.description);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMyProducts = async () => {
        try {
            const { data: vendor } = await api.get('/vendors/me/');
            const { data: products } = await api.get(`/products/?vendor=${vendor.id}`);
            setProducts(products.results || products);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/vendors/analytics/');
            setAnalytics(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/products/categories/');
            setCategories(data.results || data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products/', {
                title,
                price,
                stock,
                category: category || categories[0]?.id,
                vendor: user?.id,
                slug: title.toLowerCase().replace(/ /g, '-'),
                description: 'Premium product description.'
            });
            setTitle('');
            setPrice('');
            setStock('');
            fetchMyProducts();
            setActiveTab('products');
            alert('Product added successfully');
        } catch (e) {
            alert('Failed to add product');
        }
    };

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSettingsLoading(true);
            const vendorId = vendor.id;
            await api.patch(`/vendors/${vendorId}/`, {
                store_name: storeName,
                description: storeDescription,
            });
            alert('Settings updated successfully');
            fetchVendorProfile();
        } catch (e) {
            alert('Failed to update settings');
            console.error(e);
        } finally {
            setSettingsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full pt-20">
                <div className="px-6 py-4">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Seller Tools</h2>
                    <nav className="space-y-1">
                        <SidebarLink icon={Package} label="My Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                        <SidebarLink icon={Plus} label="Add Product" active={activeTab === 'add_product'} onClick={() => setActiveTab('add_product')} />
                        <SidebarLink icon={BarChart2} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                        <SidebarLink icon={DollarSign} label="Earnings" active={activeTab === 'earnings'} onClick={() => setActiveTab('earnings')} />
                        <SidebarLink icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-24">
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'products' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                                <button onClick={() => setActiveTab('add_product')} className="btn-primary flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Add New
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <ul className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <li key={product.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 flex-shrink-0">
                                                    {product.image && <img src={product.image} className="h-full w-full object-cover rounded-lg" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.title}</p>
                                                    <p className="text-sm text-gray-500">Stock: {product.stock} • ${product.price}</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </li>
                                    ))}
                                    {products.length === 0 && (
                                        <li className="p-8 text-center text-gray-500">No products listed yet.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'add_product' && (
                        <div className="max-w-2xl mx-auto">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <form onSubmit={handleAddProduct} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g. Wireless Noise Cancelling Headphones" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                                            <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" placeholder="0.00" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Qty</label>
                                            <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="input-field" placeholder="10" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                                            <option value="">Select Category</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="pt-4 flex justify-end gap-3">
                                        <button type="button" onClick={() => setActiveTab('products')} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                                        <button type="submit" className="btn-primary">Create Product</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

                            {loading ? (
                                <div className="text-center py-12 text-gray-500">Loading analytics...</div>
                            ) : analytics ? (
                                <>
                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                                                    <p className="text-3xl font-bold text-gray-900 mt-2">${analytics.total_revenue.toFixed(2)}</p>
                                                </div>
                                                <div className="bg-green-100 p-3 rounded-lg">
                                                    <DollarSign className="h-6 w-6 text-green-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.total_orders}</p>
                                                </div>
                                                <div className="bg-blue-100 p-3 rounded-lg">
                                                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-sm font-medium">Items Sold</p>
                                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.total_items_sold}</p>
                                                </div>
                                                <div className="bg-purple-100 p-3 rounded-lg">
                                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top Products */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <Award className="h-5 w-5 text-indigo-600" />
                                            Top Selling Products
                                        </h2>
                                        <div className="space-y-3">
                                            {analytics.top_products.length > 0 ? (
                                                analytics.top_products.map((product: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{product.product__title}</p>
                                                            <p className="text-sm text-gray-500">{product.quantity_sold} units sold</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900">${product.revenue.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">No sales yet</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Revenue Chart */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <BarChart2 className="h-5 w-5 text-indigo-600" />
                                            Revenue (Last 30 Days)
                                        </h2>
                                        <div className="space-y-2">
                                            {analytics.daily_revenue.slice(-7).map((day: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-24 text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2" style={{ width: '100%' }}>
                                                        <div
                                                            className="bg-indigo-600 h-full rounded-full"
                                                            style={{ width: `${(day.revenue / Math.max(...analytics.daily_revenue.map((d: any) => d.revenue))) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="w-20 text-right text-sm font-medium text-gray-900">${day.revenue.toFixed(2)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-500">No analytics data available</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'earnings' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>

                            {loading ? (
                                <div className="text-center py-12 text-gray-500">Loading earnings data...</div>
                            ) : analytics ? (
                                <>
                                    {/* Earnings Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
                                            <p className="text-green-700 text-sm font-medium">Current Balance</p>
                                            <p className="text-4xl font-bold text-green-900 mt-2">${analytics.total_revenue.toFixed(2)}</p>
                                            <p className="text-sm text-green-700 mt-4">Available for withdrawal</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-6">
                                            <p className="text-blue-700 text-sm font-medium">This Month Revenue</p>
                                            <p className="text-4xl font-bold text-blue-900 mt-2">
                                                ${analytics.daily_revenue
                                                    .filter((d: any) => {
                                                        const date = new Date(d.date);
                                                        const now = new Date();
                                                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                                    })
                                                    .reduce((sum: number, d: any) => sum + d.revenue, 0)
                                                    .toFixed(2)}
                                            </p>
                                            <p className="text-sm text-blue-700 mt-4">From {analytics.total_orders} orders</p>
                                        </div>
                                    </div>

                                    {/* Request Payout */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-bold text-gray-900 mb-4">Request Withdrawal</h2>
                                        <div className="flex gap-4">
                                            <input
                                                type="number"
                                                placeholder="Enter amount"
                                                className="input-field flex-1"
                                                max={analytics.total_revenue}
                                            />
                                            <button className="btn-primary">Request Payout</button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Payouts are processed within 3-5 business days</p>
                                    </div>

                                    {/* Revenue Breakdown */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Breakdown</h2>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700">Total Sales</span>
                                                <span className="font-bold text-gray-900">${analytics.total_revenue.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <span className="text-gray-700">Commission (10%)</span>
                                                <span className="font-bold text-red-600">-${(analytics.total_revenue * 0.1).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <span className="text-lg font-bold text-gray-900">Net Earnings</span>
                                                <span className="text-lg font-bold text-green-600">${(analytics.total_revenue * 0.9).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-500">No earnings data available</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

                            {/* Store Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-indigo-600" />
                                    Store Information
                                </h2>
                                <form onSubmit={handleUpdateSettings} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={storeName}
                                            onChange={(e) => setStoreName(e.target.value)}
                                            className="input-field"
                                            placeholder="Your Store Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                                        <textarea
                                            rows={5}
                                            value={storeDescription}
                                            onChange={(e) => setStoreDescription(e.target.value)}
                                            className="input-field"
                                            placeholder="Tell customers about your store"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => fetchVendorProfile()}
                                            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={settingsLoading}
                                            className="btn-primary disabled:opacity-50"
                                        >
                                            {settingsLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Account Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Account Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Email Address</label>
                                        <p className="text-gray-900 font-medium mt-1">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Account Role</label>
                                        <p className="text-gray-900 font-medium mt-1">Seller</p>
                                    </div>
                                </div>
                            </div>

                            {/* Store Status */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Store Status</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-700 font-medium">Verification Status</p>
                                            <p className="text-sm text-gray-600 mt-1">Account verification determines your store's visibility</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${vendor?.is_verified
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {vendor?.is_verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                    {!vendor?.is_verified && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                Your store is pending verification. You can still add products, but they won't be visible to customers until your account is verified.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Store Statistics */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Store Statistics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Products</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Store Rating</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{vendor?.rating || '0.00'}★</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Member Since</p>
                                        <p className="text-gray-900 font-medium mt-2">
                                            {vendor?.created_at ? new Date(vendor.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
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
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
        >
            <Icon className="mr-3 h-5 w-5" />
            {label}
        </button>
    );
}
