"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        api.get("/orders").then((res) => {
            setOrders(res.data);
        });
    }, []);

    const filteredOrders =
        filter === "ALL"
            ? orders
            : orders.filter((o) => o.status === filter);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">My Orders</h1>

            <select
                className="border p-2"
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
            </select>

            <div className="mt-4 space-y-3">
                {filteredOrders.map((o) => (
                    <div key={o.id} className="border p-3">
                        <p>Order ID: {o.id}</p>
                        <p>Status: {o.status}</p>
                        <p>Total: ₹{o.totalAmount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
