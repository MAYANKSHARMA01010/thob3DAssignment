/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userStatsAPI } from "@/utils/api";
import {
    ShoppingBag,
    ShoppingCart,
    Package,
    User,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        orders: 0,
        cartItems: 0,
    });

    useEffect(() => {
        userStatsAPI.getStats().then((res) => {
            setStats({
                orders: res?.data?.totalOrders ?? 0,
                cartItems: res?.data?.totalCartItems ?? 0,
            });
        });
    }, []);

    const actions = [
        {
            title: "Browse Products",
            description: "Explore our latest collection",
            icon: <ShoppingBag className="text-indigo-400" size={24} />,
            href: "/user/products",
            color: "bg-indigo-500/10 border-indigo-500/20"
        },
        {
            title: "My Cart",
            description: "View items in your cart",
            icon: <ShoppingCart className="text-emerald-400" size={24} />,
            href: "/user/cart",
            color: "bg-emerald-500/10 border-emerald-500/20"
        },
        {
            title: "My Orders",
            description: "Track your order history",
            icon: <Package className="text-blue-400" size={24} />,
            href: "/user/orders",
            color: "bg-blue-500/10 border-blue-500/20"
        },
        {
            title: "My Profile",
            description: "Manage your account details",
            icon: <User className="text-purple-400" size={24} />,
            href: "/user/profile",
            color: "bg-purple-500/10 border-purple-500/20"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Welcome back, {user?.name} 👋
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Here's what's happening with your account today.
                    </p>
                </div>
                <Link href="/user/products">
                    <Button>
                        Browse Store <ArrowRight size={16} className="ml-2" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={<Package className="text-blue-400" size={20} />}
                />
                <StatCard
                    title="Cart Items"
                    value={stats.cartItems}
                    icon={<ShoppingCart className="text-emerald-400" size={20} />}
                />
                <StatCard
                    title="Account Type"
                    value="Customer"
                    icon={<User className="text-purple-400" size={20} />}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {actions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className={`group border rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${action.color} border-gray-800 hover:border-gray-700 bg-[#111827]/40`}
                        >
                            <div className="mb-4 p-3 bg-gray-900/50 rounded-lg w-fit group-hover:bg-gray-900 transition-colors">
                                {action.icon}
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                                {action.title}
                                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">{action.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-[#111827]/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-400">{title}</p>
                {icon}
            </div>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
    );
}
