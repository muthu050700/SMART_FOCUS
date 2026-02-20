"use client";

import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        fontSize: '16px',
                        fontWeight: '500',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        background: '#fff',
                        color: '#1f2937',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    }
                }}
            />
            <GoogleOAuthProvider clientId="386469063984-aj1ve2rdflvvv32e22fq3dnp5o3t92bl.apps.googleusercontent.com">
                {children}
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
}
