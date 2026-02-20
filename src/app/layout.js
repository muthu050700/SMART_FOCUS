import "./globals.css";
import Providers from "@/components/Providers";
export const metadata = {
    title: "Smart Focus Tuition Center",
    description: "Learn and Grow",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}