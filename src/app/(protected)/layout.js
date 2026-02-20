"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function ProtectedLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isLockedOpen, setIsLockedOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const isAuth = Cookies.get("isAuth");

        if (!isAuth) {
            router.replace("/signin");
        } else {
            router.replace("/dashboard");
        }
    }, [router]);

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
                </svg>
            )
        },
        {
            name: "Students",
            path: "/students",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            )
        },
        {
            name: "Teachers",
            path: "/teachers",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
            )
        },
        {
            name: "Attendance",
            path: "/attendance",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                </svg>
            )
        },
        {
            name: "Fees",
            path: "/fees",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75m0 0v8.25m0-9h16.5m-16.5 0c0-1.242 1.008-2.25 2.25-2.25h12c1.242 0 2.25 1.008 2.25 2.25m-16.5 0v10.5m16.5-10.5v10.5m-16.5 0a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25m-16.5 0h16.5m-16.5 0h.008v.008H3.75V18.75zm.621-5.96a.461.461 0 01.477-.965 1.19 1.19 0 00.322-.061 1.026 1.026 0 011.284.444 1.191 1.191 0 00.65.559a1.026 1.026 0 01.671 1.327 1.191 1.191 0 00.153.848 1.026 1.026 0 01-.405 1.396 1.191 1.191 0 00-.327.8 1.025 1.025 0 01-1.206.993 1.19 1.19 0 00-.796.115 1.025 1.025 0 01-1.353-.417 1.19 1.19 0 00-.671-.533 1.026 1.026 0 01-.652-1.332 1.191 1.191 0 00-.142-.851 1.026 1.026 0 01.423-1.391 1.191 1.191 0 00.324-.789zm9.055 0a.461.461 0 01.477-.965 1.19 1.19 0 00.322-.061 1.026 1.026 0 011.284.444 1.191 1.191 0 00.65.559a1.026 1.026 0 01.671 1.327 1.191 1.191 0 00.153.848 1.026 1.026 0 01-.405 1.396 1.191 1.191 0 00-.327.8 1.025 1.025 0 01-1.206.993 1.19 1.19 0 00-.796.115 1.025 1.025 0 01-1.353-.417 1.19 1.19 0 00-.671-.533 1.026 1.026 0 01-.652-1.332 1.191 1.191 0 00-.142-.851 1.026 1.026 0 01.423-1.391 1.191 1.191 0 00.324-.789z" />
                </svg>
            )
        },
        {
            name: "Settings",
            path: "/settings",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43 1.007l1.004.814a1.125 1.125 0 01.26 1.43l-1.297 2.247a1.125 1.125 0 01-1.37.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-1.007l-1.004-.814a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-blue-600 dark:bg-gray-800 z-40 flex items-center justify-between px-4 shadow-md transition-colors duration-300">
                <span className="text-white font-bold text-xl">Smart Focus</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white hover:bg-blue-700 rounded-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isLockedOpen ? 256 : 80 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`fixed left-0 top-0 bottom-0 z-50 bg-blue-600 dark:bg-gray-800 text-white shadow-2xl flex flex-col transform lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobileMenuOpen ? '!w-64' : ''} transition-colors duration-300`}
            >
                {/* Logo Area */}
                <div className={`h-20 flex items-center border-b border-white/10 shrink-0 relative transition-[padding] duration-300 ${(isLockedOpen || isMobileMenuOpen) ? 'px-6' : 'pl-5'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="min-w-[40px] w-10 h-10 rounded-xl shadow-lg flex items-center justify-center shrink-0">
                            <Image
                                src="/logo.svg"
                                alt="Smart Focus Logo"
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <AnimatePresence mode="wait">
                            {(isLockedOpen || isMobileMenuOpen) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col"
                                >
                                    <span className="font-bold text-lg leading-none tracking-tight">Smart Focus</span>
                                    <span className="text-xs text-blue-200 font-medium">Tuition Center</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsLockedOpen(!isLockedOpen)}
                        className={`hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 rounded-full bg-blue-600 border-2 border-white text-white hover:bg-blue-700 transition-all duration-300 shadow-md z-50 ${!isLockedOpen ? 'rotate-180' : ''}`}
                        title={isLockedOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-3 h-3"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-6 space-y-4 px-3">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.path;
                        const isThisHovered = hoveredIndex === index;

                        return (
                            <div
                                key={item.path}
                                className="relative"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Link
                                    href={item.path}
                                    className={`flex items-center h-12 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-white/20 text-white"
                                        : "hover:bg-white/10 text-blue-100 hover:text-white"
                                        }`}
                                    style={{
                                        width: (isLockedOpen || isMobileMenuOpen) ? '100%' : (isThisHovered ? '240px' : '56px'),
                                        position: (isLockedOpen || isMobileMenuOpen) ? 'relative' : (isThisHovered ? 'absolute' : 'relative'),
                                        zIndex: isThisHovered ? 50 : 1,
                                        backgroundColor: isThisHovered && !(isLockedOpen || isMobileMenuOpen) ? '#2562eb' : (isActive ? 'rgba(255, 255, 255, 0.2)' : ''),
                                        boxShadow: isThisHovered && !(isLockedOpen || isMobileMenuOpen) ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' : ''
                                    }}
                                >
                                    <div className="min-w-[56px] flex justify-center shrink-0">
                                        {item.icon}
                                    </div>

                                    {/* Label logic */}
                                    {((isLockedOpen || isThisHovered || isMobileMenuOpen)) && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </Link>

                                {/* Placeholder to keep space in nav when absolute */}
                                {!isLockedOpen && !isMobileMenuOpen && isThisHovered && <div className="h-12 w-14" />}
                            </div>
                        );
                    })}
                </nav>

                {/* User Info / Logout at bottom */}
                <div className="p-4 border-t border-blue-500/30 shrink-0 space-y-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        className="w-full flex items-center h-12 rounded-xl hover:bg-white/10 text-blue-100 hover:text-white transition-all duration-200 group relative"
                    >
                        <div className="min-w-[48px] flex justify-center shrink-0">
                            {mounted && resolvedTheme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </div>
                        <AnimatePresence>
                            {(isLockedOpen || isMobileMenuOpen) && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="ml-2 font-medium"
                                >
                                    {mounted && resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            Cookies.remove("isAuth");
                            router.replace("/");
                        }}
                        className="w-full flex items-center h-12 rounded-xl hover:bg-red-500/20 text-blue-100 hover:text-red-200 transition-all duration-200 group relative"
                    >
                        <div className="min-w-[48px] flex justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                        </div>
                        <AnimatePresence>
                            {(isLockedOpen || isMobileMenuOpen) && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="ml-2 font-medium"
                                >
                                    Log out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main
                className={`flex-1 transition-all duration-300 min-h-screen pt-16 lg:pt-0 ${isLockedOpen ? 'lg:ml-64' : 'lg:ml-20'}`}
            >
                <div className="px-6 py-4">
                    {children}
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
