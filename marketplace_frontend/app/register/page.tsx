'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('BUYER');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register/', {
                email,
                username,
                password,
                role
            });
            router.push('/login');
        } catch (err: any) {
            console.error(err);
            setError('Registration failed. Username or Email might be taken.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-500">Join our marketplace today</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            className="input-field pl-10"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            required
                            className="input-field pl-10"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            required
                            className="input-field pl-10"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="input-field"
                        >
                            <option value="BUYER">I want to Buy</option>
                            <option value="SELLER">I want to Sell</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-3 mt-4"
                    >
                        Sign up
                    </button>

                    <div className="text-center pt-4">
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
