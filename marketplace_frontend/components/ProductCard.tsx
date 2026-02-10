'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { clsx } from 'clsx';

interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
    vendor: number;
    category?: number;
}

export default function ProductCard({ product }: { product: Product }) {
    const { isAuthenticated } = useAuthStore();

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
        <Link href={`/products/${product.id}`} className="group block">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100">
                {/* Image Container */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                            <span className="text-4xl font-light">?</span>
                        </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-900 font-semibold text-lg leading-tight truncate pr-4 group-hover:text-indigo-600 transition-colors">
                            {product.title}
                        </h3>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        Premium quality product from our verified vendors.
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-gray-900">
                            ${product.price}
                        </span>
                        <button
                            onClick={addToCart}
                            className="p-2.5 rounded-xl bg-gray-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
