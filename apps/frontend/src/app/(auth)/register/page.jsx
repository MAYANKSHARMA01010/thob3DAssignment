"use client";

import { useEffect, useState } from "react";
import { authAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function Register() {
    const router = useRouter();
    const { isLoggedIn, isAdmin, loading } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    useEffect(() => {
        if (loading) return;

        if (isLoggedIn) {
            router.replace(
                isAdmin ? "/admin/dashboard" : "/user/dashboard"
            );
        }
    }, [isLoggedIn, isAdmin, loading, router]);

    if (loading || isLoggedIn) return null;

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

        setIsLoading(true);
        try {
            await authAPI.register(form);
            toast.success("Registration successful! Please login.");
            router.replace("/login");
        } catch (err) {
            toast.error(err.response?.data?.ERROR || "Register failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <Card className="border-gray-800 bg-[#111827]/80 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-white">
                    Create an account
                </CardTitle>
                <CardDescription>
                    Enter your details to get started
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <Input
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Input
                        name="confirm_password"
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        {!isLoading && (
                            <UserPlus size={18} className="mr-2" />
                        )}
                        Create Account
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="text-center text-sm text-gray-400">
                <span>
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                        Sign in
                    </Link>
                </span>
            </CardFooter>
        </Card>
    );
}
