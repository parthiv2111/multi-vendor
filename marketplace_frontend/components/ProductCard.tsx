'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface CategoryDetail {
    id: number;
    title: string;
    slug: string;
}

interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
    vendor: number;
    category?: number;
    category_detail?: CategoryDetail;
    sub_category?: number | null;
    sub_category_detail?: CategoryDetail | null;
    description?: string | null;
    rating?: number;
    discount?: number;
}

export default function ProductCard({ product }: { product: Product }) {
    const { isAuthenticated } = useAuthStore();
    const ratingValue = Number(product.rating ?? 0);
    const discountValue = Number(product.discount ?? 0);

    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        if (!isAuthenticated) return alert("Please login first");
        try {
            await api.post('/cart/add/', { product_id: product.id, quantity: 1 });
            // Could add toast notification here
            alert("Added to cart!");
        } catch (e) {
            alert("Failed to add to cart");
        }
    };

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-indigo-100 h-full flex flex-col">
                {/* Image Container */}
                <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden group-hover:bg-gray-100 transition-colors">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                            <span className="text-4xl font-light">?</span>
                        </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 flex flex-col gap-2">
                        <button className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:text-red-500 hover:shadow-md transition-all active:scale-95">
                            <Heart className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Badges */}
                    {discountValue > 0 && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                {discountValue}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="text-gray-900 font-bold text-lg leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors">
                            {product.title}
                        </h3>
                    </div>

                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                        {product.category_detail?.title || "Uncategorized"}
                        {product.sub_category_detail?.title ? ` / ${product.sub_category_detail.title}` : ""}
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-yellow-400">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <Star
                                    key={index}
                                    className={
                                        ratingValue >= index + 1
                                            ? "h-3 w-3 fill-current"
                                            : "h-3 w-3 text-gray-200"
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">({ratingValue.toFixed(1)})</span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                        {product.description || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <div>
                            <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Price</span>
                            <span className="text-xl font-bold text-gray-900">
                                ${product.price}
                            </span>
                        </div>
                        <button
                            onClick={addToCart}
                            className="p-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-indigo-200 active:scale-95 group/btn"
                        >
                            <ShoppingCart className="h-5 w-5 group-hover/btn:animate-bounce" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
