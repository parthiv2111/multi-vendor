'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/login/', { email, password });
            await login(data.access, data.refresh);
            router.push('/');
        } catch (err: any) {
            if (err.response?.status === 400 || err.response?.status === 401) {
                try {
                    const { data } = await api.post('/auth/login/', { username: email, password });
                    await login(data.access, data.refresh);
                    router.push('/');
                    return;
                } catch (retryErr) {
                    setError('Invalid credentials');
                }
            } else {
                setError('Login failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-500">Sign in to access your account</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                id="email"
                                type="text"
                                required
                                className="input-field"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-3"
                    >
                        Sign in
                    </button>

                    <div className="text-center pt-4">
                        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                            Don't have an account? Create one
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
