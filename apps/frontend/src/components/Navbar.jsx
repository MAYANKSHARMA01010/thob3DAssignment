"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Package,
    User,
    Users,
    PlusCircle,
    ClipboardList,
    LogOut
} from "lucide-react";

export default function Navbar() {
    const { isLoggedIn, isAdmin, user, logout } = useAuth();
    const pathname = usePathname();

    const isActive = (path) =>
        pathname === path ? "text-white" : "text-gray-400 hover:text-white";

    return (
        <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-lg">
                InventoryPro
            </Link>

            <div className="flex gap-6 items-center text-sm">
                {!isLoggedIn && (
                    <>
                        <Link href="/login" className="hover:text-gray-300">
                            Login
                        </Link>
                        <Link href="/register" className="hover:text-gray-300">
                            Register
                        </Link>
                    </>
                )}

                {isLoggedIn && !isAdmin && (
                    <>
                        <NavItem href="/user/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" active={isActive("/user/dashboard")} />
                        <NavItem href="/user/products" icon={<ShoppingBag size={16} />} label="Products" active={isActive("/user/products")} />
                        <NavItem href="/user/cart" icon={<ShoppingCart size={16} />} label="Cart" active={isActive("/user/cart")} />
                        <NavItem href="/user/orders" icon={<Package size={16} />} label="Orders" active={isActive("/user/orders")} />
                        <NavItem href="/user/profile" icon={<User size={16} />} label="Profile" active={isActive("/user/profile")} />
                    </>
                )}

                {isLoggedIn && isAdmin && (
                    <>
                        <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={16} />} label="Admin" active={isActive("/admin/dashboard")} />
                        <NavItem href="/admin/users" icon={<Users size={16} />} label="Users" active={isActive("/admin/users")} />
                        <NavItem href="/admin/products" icon={<ShoppingBag size={16} />} label="Products" active={isActive("/admin/products")} />
                        <NavItem href="/admin/orders" icon={<ClipboardList size={16} />} label="Orders" active={isActive("/admin/orders")} />
                        <NavItem href="/admin/products/new" icon={<PlusCircle size={16} />} label="Add Product" active={isActive("/admin/products/new")} />
                    </>
                )}

                {isLoggedIn && (
                    <div className="flex items-center gap-3 ml-4 border-l border-gray-700 pl-4">
                        <span className="text-gray-300">{user?.name}</span>
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

function NavItem({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-1 ${active} transition`}
        >
            {icon}
            {label}
        </Link>
    );
}
