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

    return (
        <>
            <main className="p-6">{children}</main>
        </>
    );
}
