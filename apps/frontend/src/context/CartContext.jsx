"use client";

import { createContext, useContext, useReducer } from "react";
import { cartReducer, cartInitialState } from "../reducer/cartReducer.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, cartInitialState);

    const addToCart = (product, quantity = 1) => {
        dispatch({
            type: "ADD_TO_CART",
            payload: {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity,
            },
        });
    };

    const removeFromCart = (productId) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: productId });
    };

    const updateQuantity = (productId, quantity) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { id: productId, quantity },
        });
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart: state.items,
                totalItems,
                totalPrice,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return context;
};
