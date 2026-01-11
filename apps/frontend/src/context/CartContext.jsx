"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { cartAPI } from "@/utils/api";
import { cartReducer, cartInitialState } from "@/reducer/cartReducer";
import { toast } from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, cartInitialState);

    useEffect(() => {
        cartAPI.getCart().then((res) => {
            const items =
                res?.data?.items?.map((item) => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: Number(item.product.price),
                    image: item.product.imageUrl,
                    stock: item.product.stockQuantity,
                    quantity: item.quantity,
                })) || [];

            dispatch({ type: "SET_CART", payload: items });
        });
    }, []);

    const addToCart = async (product, quantity = 1) => {
        await cartAPI.addToCart(product.id, quantity);

        dispatch({
            type: "ADD_TO_CART",
            payload: { ...product, quantity },
        });

        toast.success("Added to cart");
    };

    const increaseQty = async (productId) => {
        const item = state.items.find((i) => i.id === productId);
        if (!item || item.quantity >= item.stock) return;

        await cartAPI.updateCartItem(productId, item.quantity + 1);
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { id: productId, quantity: item.quantity + 1 },
        });
    };

    const decreaseQty = async (productId) => {
        const item = state.items.find((i) => i.id === productId);
        if (!item) return;

        if (item.quantity === 1) {
            await removeFromCart(productId);
            return;
        }

        await cartAPI.updateCartItem(productId, item.quantity - 1);
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { id: productId, quantity: item.quantity - 1 },
        });
    };

    const removeFromCart = async (productId) => {
        await cartAPI.removeFromCart(productId);
        dispatch({ type: "REMOVE_FROM_CART", payload: productId });
        toast.success("Item removed");
    };

    const clearCart = async () => {
        for (const item of state.items) {
            await cartAPI.removeFromCart(item.id);
        }
        dispatch({ type: "CLEAR_CART" });
        toast.success("Cart cleared");
    };

    const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = state.items.reduce(
        (s, i) => s + i.price * i.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart: state.items,
                totalItems,
                totalPrice,
                addToCart,
                increaseQty,
                decreaseQty,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};
