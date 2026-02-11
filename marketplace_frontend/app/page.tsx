'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Search, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

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
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Modern Background */}
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-900 to-slate-900"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-3000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-violet-500/25 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-5000"></div>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center pt-20">

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-white space-y-2 animate-fade-in-up animation-delay-150">
            Discover Future<br />
            of Shopping
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-300">
            Experience the next generation of commerce. Our AI engine finds you the best deals,
            tracks price history, and verifies vendor authenticity in real-time.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group animate-fade-in-up animation-delay-450 px-4 sm:px-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col sm:flex-row bg-white rounded-xl shadow-2xl overflow-hidden p-2 gap-2">
              <div className="flex-grow relative flex items-center">
                <Search className="absolute left-4 h-6 w-6 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for electronics, fashion, AI chips..."
                  className="w-full pl-12 pr-4 py-3 sm:py-4 text-slate-900 placeholder-slate-400 focus:outline-none text-lg font-medium bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2">
                <span>Search</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Feature Pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 text-slate-300 text-sm sm:text-base font-medium animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Verified Vendors
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
              <TrendingUp className="h-5 w-5 text-blue-400" /> AI Price Tracking
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
              <Zap className="h-5 w-5 text-amber-400" /> Instant Delivery
            </div>
          </div>
        </div>
      </section >

      {/* Product Grid */}
      < section className="w-full px-4 sm:px-6 lg:px-8" >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Trending Now</h2>
          <Link href="/products" className="group flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            View all products <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-32 text-center rounded-3xl bg-slate-50 border border-slate-200 border-dashed">
                  <div className="inline-block p-6 rounded-full bg-white shadow-sm mb-4">
                    <Search className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    We couldn't find any products matching your search. Try adjusting your keywords.
                  </p>
                </div>
              )}
            </div>
          )
        }
      </section >
    </div >
  );
}

// Helper icon
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
  )
}
