"use client";

import { useEffect, useState } from "react";
import { adminOrdersAPI } from "@/utils/api";
import { toast } from "react-hot-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const STATUS_OPTIONS = [
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
        case 'CONFIRMED': return 'default'; // Or 'info' if you treat default as info
        case 'PENDING': return 'warning';
        case 'CANCELLED': return 'destructive';
        default: return 'secondary';
    }
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        adminOrdersAPI
            .getAllOrders()
            .then((res) => {
                setOrders(res?.data?.orders || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            await adminOrdersAPI.updateOrderStatus(orderId, status);
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, status } : o
                )
            );
            toast.success("Order status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredOrders = orders.filter(order =>
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.includes(searchTerm) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Orders</h1>
                <p className="text-gray-400 mt-1">Manage and track customer orders</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#111827]/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div className="relative w-full sm:w-72">
                    <Input
                        placeholder="Search orders..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-900/50"
                    />
                </div>
                <div className="text-sm text-gray-400">
                    Total Orders: <span className="text-white font-medium">{orders.length}</span>
                </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#111827]/50 backdrop-blur-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-900/50">
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Itmes</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="group hover:bg-[#111827]/80">
                                    <TableCell className="font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{order.user.name}</span>
                                            <span className="text-xs text-gray-500">{order.user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <span key={idx} className="text-xs text-gray-400">
                                                    {item.name} <span className="text-gray-600">x{item.quantity}</span>
                                                </span>
                                            ))}
                                            {order.items.length > 2 && (
                                                <span className="text-xs text-indigo-400">+{order.items.length - 2} more</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-white">₹{order.totalAmount}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="bg-gray-900 border border-gray-700 text-xs rounded px-2 py-1 text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
