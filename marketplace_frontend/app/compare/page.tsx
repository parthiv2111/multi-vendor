'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { Search, CheckCircle2 } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  vendor: number;
  category_detail?: {
    id: number;
    title: string;
    slug: string;
  };
  sub_category_detail?: {
    id: number;
    title: string;
    slug: string;
  } | null;
  description?: string | null;
  rating?: number;
  discount?: number;
}

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((value) => value !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.includes(product.id)),
    [products, selectedIds]
  );

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Compare</h1>
            <p className="text-slate-400 mt-2">Select up to two products to compare side by side.</p>
          </div>
          <form onSubmit={handleSearch} className="w-full sm:w-[420px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products to compare..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-slate-500 border border-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8">
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-slate-400 max-w-md mx-auto">Try searching with a different keyword.</p>
              </div>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleSelection(product.id)}
                    className={
                      'w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all ' +
                      (isSelected
                        ? 'bg-emerald-400/10 border-emerald-400/40'
                        : 'bg-white/5 border-white/10 hover:border-emerald-400/30')
                    }
                  >
                    <div className="h-14 w-16 rounded-xl bg-white/10 overflow-hidden flex items-center justify-center text-slate-500">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm">No image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold line-clamp-1">{product.title}</p>
                      <p className="text-slate-400 text-sm">${product.price}</p>
                      <p className="text-slate-500 text-xs uppercase tracking-wide">
                        {product.category_detail?.title || "Uncategorized"}
                        {product.sub_category_detail?.title ? ` / ${product.sub_category_detail.title}` : ""}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-emerald-300" />}
                  </button>
                );
              })
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Comparison</h2>
            {selectedProducts.length === 0 ? (
              <p className="text-slate-400">Select two products to see details here.</p>
            ) : (
              <div className="space-y-4">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-white font-semibold mb-2 line-clamp-2">{product.title}</p>
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>
                        Category: {product.category_detail?.title || "Uncategorized"}
                        {product.sub_category_detail?.title ? ` / ${product.sub_category_detail.title}` : ""}
                      </p>
                      <p>Price: ${product.price}</p>
                      <p>Rating: {Number(product.rating ?? 0).toFixed(1)}</p>
                      <p>Discount: {Number(product.discount ?? 0).toFixed(2)}%</p>
                      <p>Vendor ID: {product.vendor}</p>
                      <p className="text-slate-500">{product.description || "No description provided."}</p>
                    </div>
                  </div>
                ))}
                {selectedProducts.length === 1 && (
                  <p className="text-slate-500 text-sm">Pick one more item to compare.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
