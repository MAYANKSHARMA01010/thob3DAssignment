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

    const {
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
    } = useCart();

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

    const getCartItem = (productId) =>
        cart.find((item) => item.id === productId);

    if (loading) {
        return (
            <p className="text-gray-400 text-center py-16">
                Loading products...
            </p>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen px-4 pb-20">
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
                        className="bg-[#0f0f0f] border border-gray-800 px-3 py-2"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="bg-[#0f0f0f] border border-gray-800 px-3 py-2"
                    >
                        <option value="ALL">All Prices</option>
                        <option value="LOW">Under ₹500</option>
                        <option value="MID">₹500 – ₹2000</option>
                        <option value="HIGH">Above ₹2000</option>
                    </select>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) =>
                                setInStockOnly(e.target.checked)
                            }
                        />
                        In stock only
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                    const cartItem = getCartItem(product.id);

                    return (
                        <div
                            key={product.id}
                            className="border border-gray-800 p-5 flex flex-col bg-[#0c0c0c]"
                        >
                            <Link href={`/user/products/${product.id}`}>
                                <img
                                    src={product.imageUrl}
                                    className="h-60 object-contain mx-auto"
                                />
                            </Link>

                            <h3 className="font-semibold mt-4">
                                {product.name}
                            </h3>

                            <p className="text-gray-400 text-sm mt-1">
                                {product.description}
                            </p>

                            <p className="text-xl font-bold mt-2">
                                ₹{product.price}
                            </p>

                            {!cartItem ? (
                                <button
                                    disabled={product.stockQuantity === 0}
                                    onClick={() =>
                                        addToCart(
                                            {
                                                id: product.id,
                                                name: product.name,
                                                price: Number(product.price),
                                                image: product.imageUrl,
                                                stock: product.stockQuantity,
                                            },
                                            1
                                        )
                                    }
                                    className="mt-5 bg-white text-black py-2 font-semibold disabled:opacity-50"
                                >
                                    {product.stockQuantity === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                                </button>
                            ) : (
                                <div className="mt-5 flex items-center justify-between border border-gray-700 px-3 py-2">
                                    <button
                                        onClick={() =>
                                            decreaseQty(product.id)
                                        }
                                        className="px-3 text-lg"
                                    >
                                        −
                                    </button>

                                    <span className="font-semibold">
                                        {cartItem.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQty(product.id)
                                        }
                                        disabled={
                                            cartItem.quantity >=
                                            product.stockQuantity
                                        }
                                        className="px-3 text-lg disabled:opacity-40"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center gap-6 pt-12">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
