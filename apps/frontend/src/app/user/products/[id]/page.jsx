/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, use } from "react";
import { productAPI } from "@/utils/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, ArrowLeft, Minus, Plus, CreditCard, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ProductDetailsPage({ params }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        productAPI
            .getProductById(id)
            .then((res) => {
                setProduct(res.data);
            })
            .catch(() => {
                toast.error("Failed to load product");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.imageUrl,
            stock: product.stockQuantity,
        }, quantity);
        toast.success("Added to cart");
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-gray-400">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">Product not found</h2>
                <p className="text-gray-400">The product you are looking for might have been removed.</p>
                <Link href="/user/products">
                    <Button>Back to Products</Button>
                </Link>
            </div>
        );
    }

    const isOutOfStock = product.stockQuantity === 0;

    return (
        <div className="max-w-6xl mx-auto py-8 lg:py-12 animate-in fade-in duration-500">
            <Link
                href="/user/products"
                className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Products
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <div className="bg-[#111827]/30 border border-gray-800 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-125 w-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <Badge variant="destructive" className="text-lg py-2 px-6">Out of Stock</Badge>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                                {product.category}
                            </Badge>
                            {product.stockQuantity > 0 && product.stockQuantity < 5 && (
                                <span className="text-amber-400 text-sm font-medium">
                                    Low Stock: Only {product.stockQuantity} left
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            {product.name}
                        </h1>
                        <div className="mt-4 flex items-end gap-4">
                            <span className="text-4xl font-bold text-white">₹{product.price}</span>
                            <span className="text-xl text-gray-500 line-through mb-1">
                                ₹{Math.round(product.price * 1.2)}
                            </span>
                            <Badge variant="outline" className="mb-2 text-indigo-400 border-indigo-500/30">
                                20% OFF
                            </Badge>
                        </div>
                    </div>

                    <div className="prose prose-invert border-y border-gray-800 py-6">
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-400">Quantity</label>
                                <div className="flex items-center bg-[#111827] border border-gray-700 rounded-lg p-1 w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1 || isOutOfStock}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition disabled:opacity-30"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-semibold text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                        disabled={quantity >= product.stockQuantity || isOutOfStock}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition disabled:opacity-30"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-400 invisible hidden sm:block">Action</label>
                                <Button
                                    size="lg"
                                    className="w-full h-12.5 text-lg font-semibold bg-indigo-600 hover:bg-indigo-500"
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                >
                                    <ShoppingCart className="mr-2" size={20} />
                                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <div className="p-2 bg-gray-800/50 rounded-full text-indigo-400">
                                    <Truck size={18} />
                                </div>
                                <span>Free Delivery</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <div className="p-2 bg-gray-800/50 rounded-full text-emerald-400">
                                    <ShieldCheck size={18} />
                                </div>
                                <span>1 Year Warranty</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <div className="p-2 bg-gray-800/50 rounded-full text-blue-400">
                                    <CreditCard size={18} />
                                </div>
                                <span>Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
