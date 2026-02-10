'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { ShoppingCart, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [inCart, setInCart] = useState(false);
    const [id, setId] = useState<string>('');

    useEffect(() => {
        params.then(p => setId(p.id));
    }, [params]);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}/`);
            setProduct(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        if (!isAuthenticated) return router.push('/login');
        try {
            await api.post('/cart/add/', { product_id: product.id, quantity: 1 });
            setInCart(true);
            // Could add toast here
        } catch (e) {
            alert('Failed to add to cart');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!product) return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] text-gray-500">
            <p className="text-xl mb-4">Product not found</p>
            <Link href="/" className="text-indigo-600 hover:underline">Return Home</Link>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </button>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                        <div className="aspect-[4/3] w-full relative">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-center object-cover hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <span className="text-6xl font-thin">?</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mb-4">
                                Verified Vendor
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{product.title}</h1>

                            <div className="flex items-center gap-4">
                                <p className="text-3xl text-indigo-600 font-bold">${product.price}</p>
                                <div className="flex items-center pl-4 border-l border-gray-200">
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <Star
                                                key={rating}
                                                className={clsx(
                                                    rating < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300',
                                                    'h-5 w-5 flex-shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <p className="ml-2 text-sm text-gray-500">117 reviews</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-indigo text-gray-500 mb-8">
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <Truck className="h-6 w-6 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                                    <p className="text-xs text-gray-500">On orders over $100</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <Shield className="h-6 w-6 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">2 Year Warranty</p>
                                    <p className="text-xs text-gray-500">Full coverage</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={addToCart}
                                disabled={inCart || product.stock < 1}
                                className="flex-1 bg-indigo-600 border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {product.stock < 1 ? 'Out of Stock' : (inCart ? 'In Cart' : 'Add to Bag')}
                            </button>
                            <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
                                <Star className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
