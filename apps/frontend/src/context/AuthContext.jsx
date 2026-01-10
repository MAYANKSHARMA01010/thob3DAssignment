/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const res = await authAPI.profile();
            setUser(res.data.user);
        } catch (err) {
            logout(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        await loadUser();
    };

    const logout = (redirect = true) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);

        if (redirect && typeof window !== "undefined") {
            window.location.href = "/login";
        }
    };

    const isLoggedIn = Boolean(token);
    const isAdmin = user?.role === "ADMIN";

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isLoggedIn,
                isAdmin,
                login,
                logout,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};
