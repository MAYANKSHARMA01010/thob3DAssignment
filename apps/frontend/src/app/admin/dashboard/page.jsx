"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminStatsAPI } from "@/utils/api";
import {
    Users,
    Package,
    ShoppingCart,
    PlusCircle,
    ClipboardList,
    ArrowUpRight
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminStatsAPI
            .getStats()
            .then((res) => {
                setStats({
                    users: res?.data?.totalUsers ?? 0,
                    products: res?.data?.totalProducts ?? 0,
                    orders: res?.data?.totalOrders ?? 0,
                });
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-400 mt-2">
                    Welcome back. Here's what's happening today.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    title="Total People"
                    value={stats.users}
                    icon={Users}
                    trend="up"
                    trendValue="12%"
                />
                <StatCard
                    title="Total Products"
                    value={stats.products}
                    icon={Package}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={ShoppingCart}
                    trend="up"
                    trendValue="4%"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ActionCard
                        title="Manage Users"
                        icon={Users}
                        href="/admin/users"
                        description="View and manage user accounts"
                    />
                    <ActionCard
                        title="Manage Products"
                        icon={Package}
                        href="/admin/products"
                        description="Add or edit product listings"
                    />
                    <ActionCard
                        title="View Orders"
                        icon={ClipboardList}
                        href="/admin/orders"
                        description="Check recent order status"
                    />
                    <ActionCard
                        title="Add Product"
                        icon={PlusCircle}
                        href="/admin/products?create=true"
                        description="Create a new product listing"
                        highlight
                    />
                </div>
            </div>
        </div>
    );
}

function ActionCard({ title, icon: Icon, href, description, highlight }) {
    return (
        <Link href={href}>
            <Card className={cn(
                "h-full transition-all duration-300 hover:scale-[1.02] hover:bg-[#111827] group cursor-pointer border-gray-800",
                highlight && "border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10"
            )}>
                <CardContent className="p-6">
                    <div className={cn(
                        "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 group-hover:bg-indigo-500/20 transition-colors",
                        highlight && "bg-indigo-500/20 text-indigo-400"
                    )}>
                        <Icon className={cn("h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors", highlight && "text-indigo-400")} />
                    </div>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">{title}</h3>
                        <ArrowUpRight className="h-4 w-4 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">{description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 bg-gray-800 rounded w-1/3" />
                <div className="h-4 bg-gray-800/50 rounded w-1/4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-800 rounded-xl border border-gray-700/50" />
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-gray-800 rounded-xl border border-gray-700/50" />
                ))}
            </div>
        </div>
    );
}
