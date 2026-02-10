'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Search, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  vendor: number;
  category: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/?search=${query}`);
      setProducts(data.results || data);
    } catch (error) {
      console.error("Failed to fetch products", error);
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
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white shadow-2xl mx-4 sm:mx-0">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>

        <div className="relative z-10 px-6 py-20 sm:px-12 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md mb-8 border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-indigo-100">AI-Powered Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">Extraordinary</span><br />
            Products Daily
          </h1>

          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the future of shopping with our AI comparison engine.
            Find the best deals from verified premium vendors.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex bg-white rounded-xl shadow-xl overflow-hidden p-1">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for electronics, fashion, AI chips..."
                  className="w-full pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md">
                Search
              </button>
            </div>
          </form>

          <div className="mt-12 flex justify-center gap-8 text-indigo-200 text-sm font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Verified Vendors
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> AI Price Tracking
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
          <Link href="/products" className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
            View all &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
