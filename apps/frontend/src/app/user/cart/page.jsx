"use client";

import { useCart } from "@/context/CartContext";
import { orderAPI } from "@/utils/api";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500">Your cart is empty</p>
                <Link href="/user/products" className="mt-4 font-medium">
                    Continue Shopping →
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Cart</h1>
                <button
                    onClick={clearCart}
                    className="text-red-500 text-sm"
                >
                    Clear Cart
                </button>
            </div>

            <div className="space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="border p-4 flex items-center gap-4"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-contain"
                        />

                        <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p>₹{item.price}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => decreaseQty(item.id)}
                                className="border px-3"
                            >
                                −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => increaseQty(item.id)}
                                className="border px-3"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t pt-6 flex justify-between items-center">
                <div>
                    <p>Total Items: {totalItems}</p>
                    <p className="text-xl font-bold">
                        Total: ₹{totalPrice}
                    </p>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    className="bg-black text-white px-6 py-3 hover:bg-gray-900"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}
