"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Home() {
    const { isLoggedIn, isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (isLoggedIn) {
            router.replace(
                isAdmin ? "/admin/dashboard" : "/user/dashboard"
            );
        }
    }, [loading, isLoggedIn, isAdmin, router]);

    if (loading || isLoggedIn) return null;

    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-[#0B0F19] overflow-hidden relative selection:bg-indigo-500/30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Order & Inventory System v1.0
                </div>

                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 tracking-tight leading-tight">
                    Manage your business <br /> with confidence.
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    A robust, secure, and intuitive platform to manage products,
                    inventory, and customer orders.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Link href="/login">
                        <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-gray-200">
                            Get Started <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 px-8 border-gray-700 bg-transparent hover:bg-white/5 text-white"
                        >
                            Create Account
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-gray-800/50 mt-20">
                    <Feature icon={<LayoutDashboard />} title="Real-time Dashboard" />
                    <Feature icon={<ShieldCheck />} title="Role-Based Access" />
                    <Feature icon={<ArrowRight />} title="Seamless Workflow" />
                </div>
            </div>
        </section>
    );
}

function Feature({ icon, title }) {
    return (
        <div className="space-y-3 text-center">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mx-auto text-indigo-400 mb-4">
                {icon}
            </div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-500">
                Optimized experience designed for modern business operations.
            </p>
        </div>
    );
}
