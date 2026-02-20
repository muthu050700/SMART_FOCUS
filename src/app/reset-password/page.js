
'use client';
import { Suspense } from "react";
export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';


function ResetPasswordInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link');
            router.push('/signin');
        }
    }, [token, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/reset-password', {
                token,
                password
            });
            toast.success(res.data.message || 'Password reset successful!');
            setTimeout(() => {
                router.push('/signin');
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden">
            {/* Left Section - Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white"
            >
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-3xl font-bold text-gray-900 tracking-tight"
                        >
                            Reset Password
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mt-2 text-gray-600"
                        >
                            Enter your new password below.
                        </motion.p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all duration-200"
                                    placeholder="Enter new password"
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.995 12.32c-.07.207-.07.431 0 .639C3.423 16.49 7.36 19.5 12 19.5c2.042 0 3.97-.492 5.617-1.36M6.228 6.228A9.956 9.956 0 0112 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639-.488 1.418-1.3 2.726-2.36 3.828M6.228 6.228L3 3m3.228 3.228l12.544 12.544" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                        {/* ...existing code for confirm password, submit button, etc. ... */}
                    </form>
                    {/* ...existing code for sign in link ... */}
                </div>
            </motion.div>
            {/* Right Section - Image */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:block lg:w-1/2 relative"
            >
                <div className="absolute inset-0 bg-blue-900/10 z-10"></div>
                <Image
                    src="/login-bg-v2.png"
                    alt="Tuition Center"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="z-0"
                    priority
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 bg-linear-to-t from-black/60 to-transparent">
                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="max-w-md"
                    >
                        <p className="text-2xl font-medium text-white">
                            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
                        </p>
                        <footer className="mt-4 text-gray-200 font-medium">– Sathish</footer>
                    </motion.blockquote>
                </div>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordInner />
        </Suspense>
    );
}
