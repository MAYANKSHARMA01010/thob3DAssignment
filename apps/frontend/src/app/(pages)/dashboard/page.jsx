"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">
          Welcome, {user?.name}
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="border p-4">Browse Products</div>
          <div className="border p-4">My Orders</div>
          <div className="border p-4">Profile</div>
        </div>
      </div>
    </>
  );
}
