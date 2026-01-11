/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { productAPI } from "@/utils/api";
import { useCart } from "@/context/CartContext";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, ShoppingCart, Loader2 } from "lucide-react";

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

const ProductSkeleton = () => (
    <div className="rounded-xl border border-gray-800 bg-[#111827]/30 backdrop-blur-sm overflow-hidden h-full flex flex-col animate-pulse">
        <div className="h-48 bg-gray-800/50 w-full" />
        <div className="p-5 space-y-3 flex-1">
            <div className="h-6 bg-gray-800/50 rounded w-3/4" />
            <div className="h-4 bg-gray-800/50 rounded w-full" />
            <div className="h-4 bg-gray-800/50 rounded w-2/3" />
        </div>
        <div className="p-5 pt-0 mt-auto">
            <div className="h-10 bg-gray-800/50 rounded w-full" />
        </div>
    </div>
);

export default function UserProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [category, setCategory] = useState("ALL");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [priceRange, setPriceRange] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const {
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
    } = useCart();

    useEffect(() => {
        setLoading(true);
        productAPI
            .getProducts(page, 20)
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

            if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            if (priceRange !== "ALL") {
                const price = Number(p.price);
                if (priceRange === "LOW" && price > 500) return false;
                if (priceRange === "MID" && (price < 500 || price > 2000))
                    return false;
                if (priceRange === "HIGH" && price < 2000) return false;
            }

            return true;
        });
    }, [products, category, inStockOnly, priceRange, searchTerm]);

    const getCartItem = (productId) =>
        cart.find((item) => item.id === productId);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-gray-400 mt-1">Discover our curated collection of premium items.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="sticky top-20 z-10 bg-[#0B0F19]/95 backdrop-blur-md border border-gray-800 rounded-xl p-4 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <Input
                            placeholder="Search..."
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-900/50"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-gray-900/50 border border-gray-700 text-sm rounded-lg block w-full p-2.5 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
                        ))}
                    </select>

                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="bg-gray-900/50 border border-gray-700 text-sm rounded-lg block w-full p-2.5 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="ALL">All Prices</option>
                        <option value="LOW">Under ₹500</option>
                        <option value="MID">₹500 – ₹2000</option>
                        <option value="HIGH">Above ₹2000</option>
                    </select>

                    <label className="flex items-center justify-center md:justify-start gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-600 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">In Stock Only</span>
                    </label>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/50 text-gray-400 mb-4">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">No products found</h3>
                    <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
                    <Button
                        variant="outline"
                        className="mt-6"
                        onClick={() => {
                            setCategory("ALL");
                            setPriceRange("ALL");
                            setSearchTerm("");
                            setInStockOnly(false);
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => {
                        const cartItem = getCartItem(product.id);
                        const isOutOfStock = product.stockQuantity === 0;

                        return (
                            <div key={product.id} className="group relative flex flex-col h-full bg-[#111827]/30 border border-gray-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                                <Link href={`/user/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-900/50">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                            <Badge variant="destructive" className="text-sm py-1 px-3">Out of Stock</Badge>
                                        </div>
                                    )}
                                    {!isOutOfStock && product.stockQuantity < 5 && (
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="warning" className="text-xs">
                                                Only {product.stockQuantity} left
                                            </Badge>
                                        </div>
                                    )}
                                </Link>

                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{product.category}</Badge>
                                    </div>

                                    <Link href={`/user/products/${product.id}`} className="block group-hover:text-indigo-400 transition-colors">
                                        <h3 className="font-semibold text-white line-clamp-1">{product.name}</h3>
                                    </Link>

                                    <p className="text-gray-400 text-sm mt-1 line-clamp-2 h-10 mb-4">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-800/50">
                                        <span className="text-lg font-bold text-white">₹{product.price}</span>

                                        {!cartItem ? (
                                            <Button
                                                size="sm"
                                                disabled={isOutOfStock}
                                                onClick={() => addToCart({
                                                    id: product.id,
                                                    name: product.name,
                                                    price: Number(product.price),
                                                    image: product.imageUrl,
                                                    stock: product.stockQuantity,
                                                }, 1)}
                                                className={isOutOfStock ? "opacity-50" : ""}
                                            >
                                                <ShoppingCart size={16} className="mr-2" />
                                                Add
                                            </Button>
                                        ) : (
                                            <div className="flex items-center bg-gray-800 rounded-lg p-0.5 border border-gray-700">
                                                <button
                                                    onClick={() => decreaseQty(product.id)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium text-white">{cartItem.quantity}</span>
                                                <button
                                                    onClick={() => increaseQty(product.id)}
                                                    disabled={cartItem.quantity >= product.stockQuantity}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition disabled:opacity-30 disabled:hover:bg-transparent"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination - Only show if we have pages */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-4 pt-8">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center px-4 font-medium text-gray-400">
                        Page <span className="text-white mx-1">{page}</span> of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
