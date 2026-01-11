"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get("/admin/products").then((res) => {
            setProducts(res.data);
        });
    }, []);

    const toggleVisibility = async (id) => {
        await api.patch(`/admin/products/${id}/visibility`);

        setProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, isVisible: !p.isVisible } : p
            )
        );
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">All Products</h1>

            <div className="space-y-3">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="border p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{p.name}</p>
                            <p className="text-sm text-gray-500">
                                ₹{p.price} | Stock: {p.stockQuantity}
                            </p>
                        </div>

                        <button
                            onClick={() => toggleVisibility(p.id)}
                            className={`px-3 py-1 text-sm ${
                                p.isVisible
                                    ? "bg-red-600 text-white"
                                    : "bg-green-600 text-white"
                            }`}
                        >
                            {p.isVisible ? "Hide" : "Show"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
