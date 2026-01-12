/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useCart } from "@/context/CartContext";
import { orderAPI } from "@/utils/api";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
    const router = useRouter();

    const {
        cart,
        totalItems,
        totalPrice,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
    } = useCart();

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        try {
            await orderAPI.placeOrder();
            toast.success("Order placed successfully");
            clearCart();
            router.push("/user/orders");
        } catch (error) {
            toast.error("Failed to place order");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-full bg-[#111827] flex items-center justify-center border border-gray-800">
                    <ShoppingBag size={32} className="text-gray-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
                    <p className="text-gray-400">Looks like you haven't added anything yet.</p>
                </div>
                <Link href="/user/products">
                    <Button size="lg" className="mt-4">
                        Continue Shopping <ArrowRight size={16} className="ml-2" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-400 mb-8">{totalItems} items in your cart</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-[#111827]/30 border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex gap-6 items-center transition-all duration-300"
                        >
                            <div className="h-24 w-24 bg-white/5 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                        title="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <p className="text-gray-400 text-sm">Unit Price: ₹{item.price}</p>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center bg-[#0B0F19] border border-gray-700 rounded-lg p-1">
                                        <button
                                            onClick={() => decreaseQty(item.id)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-10 text-center font-medium text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQty(item.id)}
                                            disabled={item.quantity >= item.stock}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition disabled:opacity-30"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <p className="font-bold text-white text-lg">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearCart}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                            Clear Cart
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-[#111827]/50 border border-gray-800 rounded-xl p-6 sticky top-24 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-white">₹{totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span className="text-emerald-400">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax</span>
                                <span className="text-white">₹0</span>
                            </div>
                            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-2xl font-bold text-white">₹{totalPrice}</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                            onClick={handlePlaceOrder}
                        >
                            Checkout
                        </Button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Secure Checkout - SSL Encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
