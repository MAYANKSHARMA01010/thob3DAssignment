/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(stored);
    }, []);

    const removeItem = (id) => {
        const updated = cart.filter((i) => i.id !== id);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">My Cart</h1>

            {cart.length === 0 && <p>Cart is empty</p>}

            {cart.map((item) => (
                <div
                    key={item.id}
                    className="border p-3 flex justify-between"
                >
                    <span>
                        {item.name} × {item.quantity}
                    </span>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500"
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}
