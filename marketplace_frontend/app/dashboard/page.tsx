'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { Plus, Package, DollarSign, BarChart2, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('products'); // products, add_product, analytics

    // Add Product Form State
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<any[]>([]);

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
    }, [isAuthenticated, user, router]);

    const fetchMyProducts = async () => {
        try {
            const { data: vendor } = await api.get('/vendors/me/');
            const { data: products } = await api.get(`/products/?vendor=${vendor.id}`);
            setProducts(products.results || products);
        } catch (e) {
            console.error(e);
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
