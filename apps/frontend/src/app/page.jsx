"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Home() {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (isLoggedIn && user) {
      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }
  }, [loading, isLoggedIn, user, router]);

  if (loading || isLoggedIn) return null;

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#0B0F19] active overflow-hidden relative selection:bg-indigo-500/30">

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-5">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
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
          A robust, secure, and intuitive platform to manage products, inventory, and customer orders. Designed for modern businesses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-base bg-white text-black hover:bg-gray-200 hover:text-black border-0">
              Get Started <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-gray-700 bg-transparent hover:bg-white/5 text-white">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-gray-800/50 mt-20">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mx-auto text-indigo-400 mb-4">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-white font-semibold text-lg">Real-time Dashboard</h3>
            <p className="text-sm text-gray-500">Track orders and inventory levels with live updates and visual stats.</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mx-auto text-purple-400 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-white font-semibold text-lg">Role-Based Access</h3>
            <p className="text-sm text-gray-500">Secure admin and user portals with dedicated permissions and views.</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mx-auto text-emerald-400 mb-4">
              <ArrowRight size={24} />
            </div>
            <h3 className="text-white font-semibold text-lg">Seamless Workflow</h3>
            <p className="text-sm text-gray-500">Optimized for efficiency, from product listing to order fulfillment.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
