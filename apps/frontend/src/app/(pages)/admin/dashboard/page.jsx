"use client";

import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="border p-4">Total Products</div>
          <div className="border p-4">Low Stock</div>
          <div className="border p-4">Orders</div>
          <div className="border p-4">Revenue</div>
        </div>
      </div>
    </>
  );
}
