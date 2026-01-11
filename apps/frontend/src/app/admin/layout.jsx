"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
    const { isLoggedIn, isAdmin } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = "/login";
        } else if (!isAdmin) {
            window.location.href = "/user/dashboard";
        }
    }, [isLoggedIn, isAdmin]);

    return (
        <>
            <main className="p-6">{children}</main>
        </>
    );
}
