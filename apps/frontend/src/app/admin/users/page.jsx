"use client";

import { useEffect, useState } from "react";
import { adminUsersAPI } from "@/utils/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Search, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        adminUsersAPI
            .getAllUsers()
            .then((res) => {
                setUsers(res?.data?.users || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
                <p className="text-gray-400 mt-1">Manage and view registered users</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#111827]/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div className="relative w-full sm:w-72">
                    <Input
                        placeholder="Search users..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-900/50"
                    />
                </div>
                <div className="text-sm text-gray-400">
                    Total Users: <span className="text-white font-medium">{users.length}</span>
                </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#111827]/50 backdrop-blur-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-900/50">
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Total Orders</TableHead>
                            <TableHead className="text-right">Total Spent</TableHead>
                            <TableHead className="text-right">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-400">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-400">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((u) => (
                                <TableRow key={u.id} className="group hover:bg-[#111827]/80">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <User size={18} />
                                            </div>
                                            <span className="font-medium text-white">{u.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Mail size={14} />
                                            <span>{u.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{u.totalOrders}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-emerald-400">
                                        ₹{u.totalSpent}
                                    </TableCell>
                                    <TableCell className="text-right text-gray-500 text-sm">
                                        {new Date(u.createdAt).toLocaleDateString()}
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
