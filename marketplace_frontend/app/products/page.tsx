'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
    vendor: number;
    category?: number;
}

interface PaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const pageSize = 12;

    const fetchProducts = async (query = '', page = 1) => {
        setLoading(true);
        try {
            const encodedQuery = encodeURIComponent(query);
            const { data } = await api.get(`/products/?search=${encodedQuery}&page=${page}&page_size=${pageSize}`);

            // Handle both paginated and non-paginated responses
            if (data.results) {
                setProducts(data.results);
                setTotalCount(data.count || 0);
                setHasNext(!!data.next);
                setHasPrev(!!data.previous);
            } else {
                setProducts(data);
                setTotalCount(data.length);
                setHasNext(false);
                setHasPrev(false);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts('', 1);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts(search, 1);
    };

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchProducts(search, nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        if (prevPage >= 1) {
            setCurrentPage(prevPage);
            fetchProducts(search, prevPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

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
                    <>
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

                        {/* Pagination Controls */}
                        {products.length > 0 && (
                            <div className="mt-12 flex items-center justify-between">
                                {/* Left Section - Results Info */}
                                <div className="text-sm text-slate-400">
                                    Showing <span className="font-semibold text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                    <span className="font-semibold text-white">
                                        {Math.min(currentPage * pageSize, totalCount)}
                                    </span>{' '}
                                    of <span className="font-semibold text-white">{totalCount}</span> products
                                </div>

                                {/* Middle Section - Page Numbers */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={!hasPrev}
                                        className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => {
                                                        setCurrentPage(pageNum);
                                                        fetchProducts(search, pageNum);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
                                                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-white'
                                                        : 'border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={handleNextPage}
                                        disabled={!hasNext}
                                        className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Right Section - Page Info */}
                                <div className="text-sm text-slate-400">
                                    Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
                                    <span className="font-semibold text-white">{totalPages}</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
