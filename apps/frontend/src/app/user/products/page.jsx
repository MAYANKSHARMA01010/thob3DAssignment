/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productAPI } from "@/utils/api";
import { useCart } from "@/context/CartContext";

export default function UserProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    if (loading) {
        return (
            <p className="text-gray-400 text-center py-10">
                Loading products...
            </p>
        );
    }

    return (
        <div className="space-y-10 bg-black text-white min-h-screen">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Products
                </h1>
                <p className="text-gray-400 mt-1">
                    Browse available products
                </p>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-400">
                    No products available.
                </p>
            ) : (
                <>
                    {/* PRODUCTS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group border border-gray-800 rounded-xl p-5 bg-[#0b0b0b] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition flex flex-col"
                            >
                                {/* PRODUCT LINK */}
                                <Link
                                    href={`/user/products/${product.id}`}
                                    className="flex flex-col gap-4"
                                >
                                    {/* IMAGE */}
                                    <div className="w-full h-64 bg-[#111] rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* INFO */}
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-semibold text-lg text-white line-clamp-1">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <p className="font-bold text-xl mt-1 text-white">
                                            ₹{product.price}
                                        </p>
                                    </div>
                                </Link>

                                {/* ADD TO CART */}
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
                                    className="mt-4 bg-white text-black py-2.5 text-sm font-semibold rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {product.stockQuantity === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    <div className="flex items-center justify-center gap-4 pt-8">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="border border-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-400">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="border border-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
