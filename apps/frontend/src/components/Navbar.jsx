"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import {
    ShoppingBag,
    ShoppingCart,
    User,
    LogOut,
    Menu,
    X,
    Search
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

export default function Navbar() {
    const { isLoggedIn, isAdmin, user, logout } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (pathname.startsWith("/admin")) {
        return null;
    }

    const isActive = (path) => pathname === path;

    const handleLogout = () => {
        toast.success("Logged out successfully");
        logout();
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0B0F19]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                            <span className="font-bold text-white">I</span>
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:block">InventoryPro</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">

                        {isLoggedIn && !isAdmin && (
                            <div className="flex items-center gap-8">
                                <NavLink href="/user/dashboard" active={isActive("/user/dashboard")}>Dashboard</NavLink>
                                <NavLink href="/user/products" active={isActive("/user/products")}>Products</NavLink>
                                <NavLink href="/user/orders" active={isActive("/user/orders")}>Orders</NavLink>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {!isLoggedIn ? (
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                {!isAdmin && (
                                    <Link href="/user/cart">
                                        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
                                            <ShoppingCart size={20} />
                                            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 px-0 flex items-center justify-center">0</Badge>
                                        </Button>
                                    </Link>
                                )}

                                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-800">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
                                        <span className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Customer'}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                                        <LogOut size={18} className="text-gray-400 hover:text-red-400 transition-colors" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <button
                            className="md:hidden text-gray-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-800 bg-[#0B0F19] p-4 space-y-4">
                    {isLoggedIn && !isAdmin && (
                        <div className="flex flex-col space-y-2">
                            <MobileNavLink href="/user/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                            <MobileNavLink href="/user/products" onClick={() => setIsMobileMenuOpen(false)}>Products</MobileNavLink>
                            <MobileNavLink href="/user/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders</MobileNavLink>
                            <MobileNavLink href="/user/cart" onClick={() => setIsMobileMenuOpen(false)}>Cart</MobileNavLink>
                        </div>
                    )}
                    {!isLoggedIn && (
                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full">Login</Button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full">Get Started</Button>
                            </Link>
                        </div>
                    )}
                    {isLoggedIn && (
                        <div className="pt-4 border-t border-gray-800">
                            <Button variant="ghost" className="w-full justify-start text-red-400" onClick={handleLogout}>
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={cn(
                "text-sm font-medium transition-colors hover:text-indigo-400",
                active ? "text-indigo-400" : "text-gray-400"
            )}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg px-2"
        >
            {children}
        </Link>
    );
}
