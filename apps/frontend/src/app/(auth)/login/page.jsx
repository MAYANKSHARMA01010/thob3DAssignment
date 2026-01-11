"use client";

import { useState } from "react";
import { authAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }

        try {
            const res = await authAPI.login({ email, password });
            await login(res.data.token);

            toast.success("Login successful");

            router.push(
                res.data.user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/dashboard"
            );
        } catch (err) {
            toast.error(err.response?.data?.ERROR || "Login failed");
        }
    };

    return (
        <form
            onSubmit={submit}
            className="max-w-md mx-auto mt-20 p-6 border"
        >
            <h2 className="text-xl font-semibold mb-4">Login</h2>

            <input
                placeholder="Email"
                className="w-full border p-2 mb-3"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 mb-4"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="w-full bg-black text-white p-2">
                Login
            </button>
        </form>
    );
}
