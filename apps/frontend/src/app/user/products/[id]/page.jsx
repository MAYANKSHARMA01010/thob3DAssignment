"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function ProductDetails({ params }) {
    const { id } = params;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        api.get(`/products/${id}`).then((res) => {
            setProduct(res.data);
        });
    }, [id]);

    if (!product) return null;

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push({ ...product, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="mt-2">{product.description}</p>
            <p className="mt-2 font-semibold">₹{product.price}</p>

            <button
                onClick={addToCart}
                className="mt-4 bg-black text-white px-4 py-2"
            >
                Add to Cart
            </button>
        </div>
    );
}
