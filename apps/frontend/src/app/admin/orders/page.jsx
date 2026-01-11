"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

const STATUSES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        api.get("/admin/orders").then((res) => {
            setOrders(res.data);
        });
    }, []);

    const updateStatus = async (id, status) => {
        await api.patch(`/admin/orders/${id}`, { status });

        setOrders((prev) =>
            prev.map((o) =>
                o.id === id ? { ...o, status } : o
            )
        );
    };

    const filteredOrders =
        filter === "ALL"
            ? orders
            : orders.filter((o) => o.status === filter);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">All Orders</h1>

            <select
                className="border p-2 mb-4"
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="ALL">All</option>
                {STATUSES.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>

            <div className="space-y-4">
                {filteredOrders.map((o) => (
                    <div key={o.id} className="border p-4">
                        <p className="font-semibold">Order ID: {o.id}</p>
                        <p>Total: ₹{o.totalAmount}</p>

                        <select
                            className="border p-2 mt-2"
                            value={o.status}
                            onChange={(e) =>
                                updateStatus(o.id, e.target.value)
                            }
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}
