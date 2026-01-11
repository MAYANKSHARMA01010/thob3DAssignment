"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function UserLayout({ children }) {
    const { isLoggedIn, isAdmin } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = "/login";
        }
        if (isAdmin) {
            window.location.href = "/admin/dashboard";
        }
    }, [isLoggedIn, isAdmin]);

    if (!isLoggedIn || isAdmin) return null;

    return (
        <div className="min-h-screen bg-[#0B0F19] pt-6 pb-20">
            <main className="container mx-auto px-4 md:px-6">
                {children}
            </main>
        </div>
    );
}
