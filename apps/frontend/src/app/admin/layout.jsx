"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }) {
    const { isLoggedIn, isAdmin } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = "/login";
        } else if (!isAdmin) {
            window.location.href = "/user/dashboard";
        }
    }, [isLoggedIn, isAdmin]);

    if (!isLoggedIn || !isAdmin) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#0B0F19]">
            <AdminSidebar />
            <div className="flex flex-1 flex-col pl-64">
                <AdminHeader />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
