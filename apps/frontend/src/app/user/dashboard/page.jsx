"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userStatsAPI } from "@/utils/api";
import {
    ShoppingBag,
    ShoppingCart,
    Package,
    User
} from "lucide-react";

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
        { title: "Browse Products", icon: <ShoppingBag />, href: "/user/products" },
        { title: "My Cart", icon: <ShoppingCart />, href: "/user/cart" },
        { title: "My Orders", icon: <Package />, href: "/user/orders" },
        { title: "My Profile", icon: <User />, href: "/user/profile" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Welcome back, {user?.name} 👋
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage everything from one place
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Orders" value={stats.orders} />
                <StatCard title="Cart Items" value={stats.cartItems} />
                <StatCard title="Account Type" value="User" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.title}
                        href={action.href}
                        className="border rounded-lg p-5 hover:shadow-md transition flex items-center gap-4"
                    >
                        <div className="p-3 bg-gray-100 rounded-lg">
                            {action.icon}
                        </div>
                        <h3 className="font-semibold">{action.title}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
    );
}
