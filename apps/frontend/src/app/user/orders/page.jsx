"use client";

import { useEffect, useMemo, useState } from "react";
import { orderAPI } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, ShieldCheck, Truck, XCircle, CheckCircle } from "lucide-react";

const STATUS_OPTIONS = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

const getStatusVariant = (status) => {
    switch (status) {
        case 'DELIVERED': return 'success';
        case 'SHIPPED': return 'default';
        case 'CONFIRMED': return 'default';
        case 'PENDING': return 'warning';
        case 'CANCELLED': return 'destructive';
        default: return 'secondary';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'DELIVERED': return <ShieldCheck size={16} className="mr-1" />;
        case 'SHIPPED': return <Truck size={16} className="mr-1" />;
        case 'CONFIRMED': return <CheckCircle size={16} className="mr-1" />;
        case 'PENDING': return <Clock size={16} className="mr-1" />;
        case 'CANCELLED': return <XCircle size={16} className="mr-1" />;
        default: return null;
    }
};

export default function UserOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortOrder, setSortOrder] = useState("DESC");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await orderAPI.getMyOrders();
                setOrders(res.data || []);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        let data = [...orders];

        if (statusFilter !== "ALL") {
            data = data.filter(
                (order) => order.status === statusFilter
            );
        }

        data.sort((a, b) => {
            const d1 = new Date(a.createdAt).getTime();
            const d2 = new Date(b.createdAt).getTime();
            return sortOrder === "DESC" ? d2 - d1 : d1 - d2;
        });

        return data;
    }, [orders, statusFilter, sortOrder]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-48 rounded-xl bg-[#111827]/30 border border-gray-800 animate-pulse" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-20 h-20 rounded-full bg-[#111827] flex items-center justify-center border border-gray-800">
                    <Package size={32} className="text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">No orders yet</h2>
                <p className="text-gray-400">Your order history will appear here once you make a purchase.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Orders</h1>
                    <p className="text-gray-400 mt-1">Track and manage your recent purchases</p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#111827] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s}</option>
                        ))}
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-[#111827] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="DESC">Newest first</option>
                        <option value="ASC">Oldest first</option>
                    </select>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-16 border rounded-xl border-dashed border-gray-800">
                    <p className="text-gray-400">No orders found matching this filter.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="group bg-[#111827]/30 border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-all duration-300"
                        >
                            <div className="p-4 sm:p-6 border-b border-gray-800 flex flex-wrap justify-between items-center bg-[#111827]/50 gap-4">
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                                        Order ID: <span className="font-mono text-gray-300">{order.id}</span>
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                </div>
                                <Badge variant={getStatusVariant(order.status)} className="flex items-center">
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </Badge>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4">
                                {order.orderItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="h-16 w-16 bg-white/5 rounded-lg p-2 flex items-center justify-center border border-gray-800">
                                            <img
                                                src={item.product.imageUrl || '/placeholder.png'}
                                                alt={item.product.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="font-medium text-white">{item.product.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                                        </div>

                                        <p className="font-medium text-white">₹{Number(item.priceAtPurchase) * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 sm:p-6 bg-[#111827]/30 border-t border-gray-800 flex justify-between items-center">
                                <span className="text-sm text-gray-400 font-medium">Total Amount</span>
                                <span className="text-xl font-bold text-white">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
