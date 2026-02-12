'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
    vendor: number;
    category?: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchProducts = async (query = '') => {
        setLoading(true);
        try {
            const encodedQuery = encodeURIComponent(query);
            const { data } = await api.get(`/products/?search=${encodedQuery}&page_size=100`);
            setProducts(data.results || data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(search);
    };

    return (
        <div className="min-h-screen pt-28 pb-16">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Products</h1>
                        <p className="text-slate-400 mt-2">Browse all listings from verified vendors.</p>
                    </div>
                    <form onSubmit={handleSearch} className="w-full sm:w-[420px]">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-slate-500 border border-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-96 bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center rounded-3xl bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                                <p className="text-slate-400 max-w-md mx-auto">
                                    Try a different keyword or remove filters.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
