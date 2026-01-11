"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import {
    Users,
    Package,
    ShoppingCart,
    PlusCircle,
    ClipboardList
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/stats")
            .then((res) => {
                setStats({
                    users: res?.data?.users ?? 0,
                    products: res?.data?.products ?? 0,
                    orders: res?.data?.orders ?? 0
                });
            })
            .catch(() => {
                setStats({
                    users: 0,
                    products: 0,
                    orders: 0
                });
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Monitor and manage the entire system
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={<Users className="h-6 w-6" />}
                />
                <StatCard
                    title="Total Products"
                    value={stats.products}
                    icon={<Package className="h-6 w-6" />}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={<ShoppingCart className="h-6 w-6" />}
                />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ActionCard
                        title="Manage Users"
                        description="View and control users"
                        icon={<Users />}
                        href="/admin/users"
                    />
                    <ActionCard
                        title="Manage Products"
                        description="Add, edit or hide products"
                        icon={<Package />}
                        href="/admin/products"
                    />
                    <ActionCard
                        title="View Orders"
                        description="Process customer orders"
                        icon={<ClipboardList />}
                        href="/admin/orders"
                    />
                    <ActionCard
                        title="Add Product"
                        description="Create a new product"
                        icon={<PlusCircle />}
                        href="/admin/products/new"
                    />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    Recent Orders
                </h2>

                <div className="border rounded-lg p-4 text-gray-600">
                    <p>No recent orders found.</p>
                    <Link
                        href="/admin/orders"
                        className="text-black font-medium mt-2 inline-block"
                    >
                        View all orders →
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="border rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
        </div>
    );
}

function ActionCard({ title, description, icon, href }) {
    return (
        <Link
            href={href}
            className="border rounded-lg p-5 hover:shadow-md transition group"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </Link>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-24 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
