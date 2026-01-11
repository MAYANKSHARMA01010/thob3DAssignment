"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Link from "next/link";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get("/products").then((res) => {
            setProducts(res.data);
        });
    }, []);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">All Products</h1>

            <div className="grid grid-cols-3 gap-4">
                {products.map((p) => (
                    <Link
                        key={p.id}
                        href={`/user/products/${p.id}`}
                        className="border p-4 hover:bg-gray-50"
                    >
                        <h2 className="font-semibold">{p.name}</h2>
                        <p>₹{p.price}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
