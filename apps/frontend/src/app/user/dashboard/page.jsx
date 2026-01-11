"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
    ShoppingBag,
    ShoppingCart,
    Package,
    User
} from "lucide-react";

export default function UserDashboard() {
    const { user } = useAuth();

    const actions = [
        {
            title: "Browse Products",
            description: "Explore all available products",
            icon: <ShoppingBag className="h-6 w-6" />,
            href: "/products",
        },
        {
            title: "My Cart",
            description: "View items added to your cart",
            icon: <ShoppingCart className="h-6 w-6" />,
            href: "/cart",
        },
        {
            title: "My Orders",
            description: "Track and manage your orders",
            icon: <Package className="h-6 w-6" />,
            href: "/orders",
        },
        {
            title: "My Profile",
            description: "Update personal information",
            icon: <User className="h-6 w-6" />,
            href: "/profile",
        },
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
                <StatCard title="Total Orders" value="12" />
                <StatCard title="Cart Items" value="3" />
                <StatCard title="Account Type" value="User" />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="border rounded-lg p-5 hover:shadow-md transition group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition">
                                    {action.icon}
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    Recent Orders
                </h2>

                <div className="border rounded-lg p-4 text-gray-600">
                    <p>No recent orders yet.</p>
                    <Link
                        href="/products"
                        className="text-black font-medium mt-2 inline-block"
                    >
                        Start Shopping →
                    </Link>
                </div>
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
