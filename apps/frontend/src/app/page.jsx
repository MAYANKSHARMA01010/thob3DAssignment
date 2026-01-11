"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
    <section className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Order & Inventory Management System
      </h1>

      <p className="text-gray-600 max-w-xl mb-6">
        Manage products, inventory, and customer orders with a
        secure role-based system.
      </p>

      <div className="flex gap-4">
        <a href="/login" className="bg-black text-white px-6 py-2">
          Login
        </a>
        <a href="/register" className="border px-6 py-2">
          Register
        </a>
      </div>
    </section>
  );
}
