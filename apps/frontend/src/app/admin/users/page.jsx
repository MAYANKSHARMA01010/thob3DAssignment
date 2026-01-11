"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/admin/users").then((res) => {
            setUsers(res.data);
        });
    }, []);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">All Users</h1>

            <div className="space-y-3">
                {users.map((u) => (
                    <div
                        key={u.id}
                        className="border p-4 flex justify-between"
                    >
                        <div>
                            <p className="font-semibold">{u.name}</p>
                            <p className="text-sm text-gray-500">
                                {u.email}
                            </p>
                        </div>
                        <span className="text-sm">{u.role}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
