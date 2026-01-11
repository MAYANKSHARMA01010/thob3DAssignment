"use client";

import { useEffect, useMemo, useState } from "react";
import { orderAPI } from "@/utils/api";

const STATUS_OPTIONS = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

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
            <p className="text-gray-400 text-center py-10">
                Loading orders...
            </p>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    You have not placed any orders yet.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold text-white">
                    My Orders
                </h1>

                <div className="flex gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="bg-black border border-gray-800 px-3 py-2 text-sm text-white"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) =>
                            setSortOrder(e.target.value)
                        }
                        className="bg-black border border-gray-800 px-3 py-2 text-sm text-white"
                    >
                        <option value="DESC">Newest first</option>
                        <option value="ASC">Oldest first</option>
                    </select>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <p className="text-gray-400">
                    No orders match this filter.
                </p>
            ) : (
                filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className="border border-gray-800 bg-[#0f0f0f] rounded-lg p-5 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Order ID
                                </p>
                                <p className="text-white text-sm">
                                    {order.id}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-400">
                                    Status
                                </p>
                                <p className="text-white font-medium">
                                    {order.status}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {order.orderItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 border-t border-gray-800 pt-3"
                                >
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-16 h-16 object-contain bg-black"
                                    />

                                    <div className="flex-1">
                                        <p className="text-white font-medium">
                                            {item.product.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="text-white">
                                        ₹
                                        {Number(
                                            item.priceAtPurchase
                                        ) * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                            <p className="text-sm text-gray-400">
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>
                            <p className="text-xl font-bold text-white">
                                ₹{order.totalAmount}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
