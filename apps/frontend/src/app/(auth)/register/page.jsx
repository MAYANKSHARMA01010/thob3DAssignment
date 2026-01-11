"use client";

import { useState } from "react";
import { authAPI } from "@/utils/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Register() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        try {
            await authAPI.register(form);
            router.push("/login");
        } catch (err) {
            setError(err.response?.data?.ERROR || "Register failed");
        }
    };

    return (
        <>
            <Navbar />
            <form
                onSubmit={submit}
                className="max-w-md mx-auto mt-20 p-6 border"
            >
                <h2 className="text-xl font-semibold mb-4">Register</h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                {["name", "email", "password", "confirm_password"].map(
                    (f) => (
                        <input
                            key={f}
                            type={f.includes("password") ? "password" : "text"}
                            placeholder={f.replace("_", " ")}
                            className="w-full border p-2 mb-3"
                            onChange={(e) =>
                                setForm({ ...form, [f]: e.target.value })
                            }
                        />
                    )
                )}
                <button className="w-full bg-black text-white p-2">
                    Register
                </button>
            </form>
        </>
    );
}
