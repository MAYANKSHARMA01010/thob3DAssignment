"use client";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        <Toaster
                            position="top-right"
                            reverseOrder={false}
                            toastOptions={{
                                duration: 2000,
                                success: {
                                    style: {
                                        background: "#16a34a",
                                        color: "#fff",
                                    },
                                },
                                error: {
                                    style: {
                                        background: "#dc2626",
                                        color: "#fff",
                                    },
                                },
                            }}
                            gutter={8}
                            containerStyle={{
                                top: 70,
                            }}
                        />

                        {children}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
