/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { productAPI } from "@/utils/api";
import { useCart } from "@/context/CartContext";

const CATEGORIES = [
    "ALL",
    "BOOKS",
    "CLOTHING",
    "ELECTRONICS",
    "ACCESSORIES",
    "FOOTWEAR",
    "HOME",
    "STATIONERY",
];

export default function UserProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [category, setCategory] = useState("ALL");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [priceRange, setPriceRange] = useState("ALL");

    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        productAPI
            .getProducts(page, 18)
            .then((res) => {
                setProducts(res.data.data || []);
                setTotalPages(res.data.pagination.totalPages || 1);
            })
            .finally(() => setLoading(false));
    }, [page]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            if (category !== "ALL" && p.category !== category) return false;
            if (inStockOnly && p.stockQuantity === 0) return false;

            if (priceRange !== "ALL") {
                const price = Number(p.price);
                if (priceRange === "LOW" && price > 500) return false;
                if (priceRange === "MID" && (price < 500 || price > 2000))
                    return false;
                if (priceRange === "HIGH" && price < 2000) return false;
            }

            return true;
        });
    }, [products, category, inStockOnly, priceRange]);

    if (loading) {
        return (
            <p className="text-gray-400 text-center py-16">
                Loading products...
            </p>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen px-4 sm:px-6 lg:px-8 pb-20">
            <div className="py-10">
                <h1 className="text-3xl font-bold">Products</h1>
                <p className="text-gray-400 mt-1">
                    Discover what fits your needs
                </p>
            </div>

            <div className="sticky top-0 z-10 bg-black border-b border-gray-800 py-4 mb-8">
                <div className="flex flex-wrap gap-4">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-[#0f0f0f] border border-gray-800 px-3 py-2 text-sm text-white"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="bg-[#0f0f0f] border border-gray-800 px-3 py-2 text-sm text-white"
                    >
                        <option value="ALL">All Prices</option>
                        <option value="LOW">Under ₹500</option>
                        <option value="MID">₹500 – ₹2000</option>
                        <option value="HIGH">Above ₹2000</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) =>
                                setInStockOnly(e.target.checked)
                            }
                            className="accent-white"
                        />
                        In stock only
                    </label>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <p className="text-gray-400">
                    No products match your filters.
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="border border-gray-800 rounded-xl p-5 bg-[#0c0c0c] hover:border-gray-700 transition flex flex-col"
                            >
                                <Link
                                    href={`/user/products/${product.id}`}
                                    className="flex flex-col gap-4"
                                >
                                    <div className="w-full h-60 bg-[#111] rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-lg line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                            {product.description}
                                        </p>
                                        <p className="font-semibold text-xl mt-2">
                                            ₹{product.price}
                                        </p>
                                    </div>
                                </Link>

                                <button
                                    onClick={() =>
                                        addToCart(
                                            {
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: product.imageUrl,
                                                stock: product.stockQuantity,
                                            },
                                            1
                                        )
                                    }
                                    disabled={product.stockQuantity === 0}
                                    className="mt-5 bg-white text-black py-2.5 text-sm font-semibold rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {product.stockQuantity === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-12">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-400">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
