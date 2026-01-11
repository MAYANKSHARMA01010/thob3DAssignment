"use client";

import { useState } from "react";
import { authAPI } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Register() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const submit = async (e) => {
        e.preventDefault();

        if (
            !form.name ||
            !form.email ||
            !form.password ||
            !form.confirm_password
        ) {
            toast.error("All fields are required");
            return;
        }

        if (form.password !== form.confirm_password) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await authAPI.register(form);
            toast.success("Registration successful");
            router.push("/login");
        } catch (err) {
            toast.error(err.response?.data?.ERROR || "Register failed");
        }
    };

    return (
        <form
            onSubmit={submit}
            className="max-w-md mx-auto mt-20 p-6 border"
        >
            <h2 className="text-xl font-semibold mb-4">Register</h2>

            {["name", "email", "password", "confirm_password"].map((f) => (
                <input
                    key={f}
                    type={f.includes("password") ? "password" : "text"}
                    placeholder={f.replace("_", " ")}
                    className="w-full border p-2 mb-3"
                    onChange={(e) =>
                        setForm({ ...form, [f]: e.target.value })
                    }
                />
            ))}

            <button className="w-full bg-black text-white p-2">
                Register
            </button>
        </form>
    );
}
