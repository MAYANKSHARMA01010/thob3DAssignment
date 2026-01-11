"use client";

import { useState } from "react";
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
    CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }

        setIsLoading(true);
        try {
            const res = await authAPI.login({ email, password });
            await login(res.data.token);

            toast.success("Login successful");

            router.push(
                res.data.user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
            );
        } catch (err) {
            toast.error(err.response?.data?.ERROR || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-gray-800 bg-[#111827]/80 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight text-white">
                    Welcome back
                </CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        {!isLoading && <LogIn size={18} className="mr-2" />}
                        Sign In
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-400">
                <div>
                    Don't have an account?{" "}
                    <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        Register
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
