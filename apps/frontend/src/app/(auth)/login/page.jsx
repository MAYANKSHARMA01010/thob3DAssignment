"use client";

import { useState } from "react";
import { authAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await authAPI.login({ email, password });
            await login(res.data.token);

            router.push(
                res.data.user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/dashboard"
            );
        } catch (err) {
            setError(err.response?.data?.ERROR || "Login failed");
        }
    };

    return (
        <>
            <form
                onSubmit={submit}
                className="max-w-md mx-auto mt-20 p-6 border"
            >
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
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
        </>
    );
}
