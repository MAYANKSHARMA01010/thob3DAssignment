"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { isLoggedIn, isAdmin, user, logout } = useAuth();

    return (
        <nav className="bg-black text-white px-6 py-4 flex justify-between">
            <Link href="/" className="font-bold text-lg">
                InventoryPro
            </Link>

            <div className="flex gap-4 items-center">
                {!isLoggedIn && (
                    <>
                        <Link href="/Login">Login</Link>
                        <Link href="/Register">Register</Link>
                    </>
                )}

                {isLoggedIn && !isAdmin && (
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/products">Products</Link>
                        <Link href="/orders">My Orders</Link>
                    </>
                )}

                {isLoggedIn && isAdmin && (
                    <>
                        <Link href="/admin/dashboard">Admin</Link>
                        <Link href="/admin/products">Products</Link>
                        <Link href="/admin/orders">Orders</Link>
                    </>
                )}

                {isLoggedIn && (
                    <>
                        <span className="text-sm opacity-80">{user?.name}</span>
                        <button
                            onClick={logout}
                            className="bg-red-600 px-3 py-1 text-sm"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
