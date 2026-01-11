"use client";

import { useEffect, useState } from "react";
import { adminOrdersAPI } from "@/utils/api";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminOrdersAPI
            .getAllOrders()
            .then((res) => {
                setOrders(res?.data?.orders || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (orderId, status) => {
        await adminOrdersAPI.updateOrderStatus(orderId, status);
        setOrders((prev) =>
            prev.map((o) =>
                o.id === orderId ? { ...o, status } : o
            )
        );
        toast.success("Order status updated");
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3" />
                <div className="h-24 bg-gray-200 rounded" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="border rounded-lg p-4 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">
                                    {order.user.name} ({order.user.email})
                                </p>
                                <p className="text-sm text-gray-500">
                                    Order ID: {order.id}
                                </p>
                            </div>

                            <select
                                value={order.status}
                                onChange={(e) =>
                                    updateStatus(order.id, e.target.value)
                                }
                                className="border px-3 py-1 text-sm"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                            {order.items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {item.name} × {item.quantity}
                                    </span>
                                    <span>
                                        ₹{item.price * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{order.totalAmount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
