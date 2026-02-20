'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import toast from 'react-hot-toast';



const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [tempToken, setTempToken] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300);
    const [isOtpLoading, setIsOtpLoading] = useState(false);
    const inputRefs = useRef([]);
    const router = useRouter();

    useEffect(() => {
        let timer;
        if (isOtpStep && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isOtpStep, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(data)) return;
        const newOtp = [...otp];
        data.split('').forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        const nextIndex = Math.min(data.length, 5);
        inputRefs.current[nextIndex].focus();
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) {
            toast.error("Please enter the full 6-digit OTP");
            return;
        }

        setIsOtpLoading(true);
        try {
            const res = await axios.post(`/api/auth/verify-otp`, {
                otp: fullOtp
            }, {
                headers: {
                    Authorization: `Bearer ${tempToken}`
                }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed");
        } finally {
            setIsOtpLoading(false);
        }
    };

    const handleResendOtp = () => {
        if (timeLeft > 0) return;
        setIsOtpStep(false);
        setOtp(['', '', '', '', '', '']);
        setTimeLeft(300);
        toast.info("Please sign in again to receive a new OTP");
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            setIsLoading(true);
            try {
                const token = credentialResponse.access_token;
                await axios.post(`/api/auth/google`, { token });
                toast.success("Logged in with Google!");
            } catch (error) {
                toast.error(error.response?.data?.message || "Google Login Failed");
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            toast.error("Google Login Failed");
        }
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/auth/signin`, {
                email,
                password,
            });

            if (res.data.success && res.data.tempToken) {
                setTempToken(res.data.tempToken);
                setIsOtpStep(true);
                toast.success(res.data.message);
                return;
            }

            toast.success(res.data.message);
            if (res.data.success) {
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setShowForgotPasswordModal(true);
    };

    const handleResetPasswordNext = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(`/api/auth/forgot-password`, {
                email: resetEmail
            });

            toast.success(res.data.message || 'Password reset link sent to your email!');
            setShowForgotPasswordModal(false);
            setResetEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
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
                    {/* Logo or Brand Name could go here */}
                    {!isOtpStep ? (
                        <>
                            <div className="mb-10">
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-3xl font-bold text-gray-900 tracking-tight"
                                >
                                    Welcome Back
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="mt-2 text-gray-600"
                                >
                                    Please enter your details to sign in.
                                </motion.p>
                            </div>

                            <form className="space-y-6" onSubmit={handleLogin}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email or Username
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            autoComplete="username"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all duration-200"
                                            placeholder="••••••••"
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                >
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Signing In...' : 'Sign in'}
                                    </button>
                                </motion.div>
                            </form>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.75 }}
                                className="my-6 flex items-center"
                            >
                                <div className="flex-1 border-t border-gray-300" />
                                <span className="px-4 text-sm text-gray-500">OR</span>
                                <div className="flex-1 border-t border-gray-300" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="flex justify-center"
                            >

                                <button
                                    onClick={() => loginWithGoogle()}
                                    type="button"
                                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.059 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                        </g>
                                    </svg>
                                    <span className="text-gray-700 font-medium">Sign in with Google</span>
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="mt-8 text-center text-sm"
                            >
                                <span className="text-gray-600">Don't have an account? </span>
                                <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                    Sign up
                                </Link>
                            </motion.div>
                        </>
                    ) : (
                        <div className="w-full">
                            <div className="mb-10 text-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl mb-6"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-3xl font-bold text-gray-900 tracking-tight"
                                >
                                    Check your email
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="mt-2 text-gray-600"
                                >
                                    We've sent a 6-digit verification code to <span className="font-semibold text-gray-900">{email}</span>.
                                </motion.p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-8">
                                <div className="flex justify-between gap-2 md:gap-4">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={handleOtpPaste}
                                            className="w-full h-14 md:h-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                                        />
                                    ))}
                                </div>

                                <div className="text-center">
                                    <p className="text-gray-500 text-sm">
                                        Code expires in: <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-blue-600'}`}>{formatTime(timeLeft)}</span>
                                    </p>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <button
                                        type="submit"
                                        // disabled={isOtpLoading || timeLeft === 0}
                                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                    >
                                        {isOtpLoading ? (
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        Verify Account
                                    </button>
                                </motion.div>

                                <div className="text-center mt-6">
                                    <p className="text-gray-600 text-sm">
                                        Didn't receive the code?{' '}
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={timeLeft > 0 || isOtpLoading}
                                            className="font-bold text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            Resend Code
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}
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
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 bg-gradient-to-t from-black/60 to-transparent">
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

            {/* Forgot Password Modal */}
            {showForgotPasswordModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => {
                        setShowForgotPasswordModal(false);
                        setResetEmail('');
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setShowForgotPasswordModal(false);
                                setResetEmail('');
                            }}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Illustration Section */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-8 pt-12 pb-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Forgot Your Password?</h2>
                            <p className="text-blue-100 text-sm">
                                No worries! We'll send you reset instructions.
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="px-8 py-8">
                            <form onSubmit={handleResetPasswordNext} className="space-y-5">
                                <div>
                                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                            </svg>
                                        </div>
                                        <input
                                            id="reset-email"
                                            type="email"
                                            required
                                            disabled={isLoading}
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Enter your email"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => {
                                            setShowForgotPasswordModal(false);
                                            setResetEmail('');
                                        }}
                                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Email
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Login;