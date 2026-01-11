import axios from "axios";
import { toast } from "react-hot-toast";

export const getBaseUrl = () => {
    const backendUrl =
        process.env.NODE_ENV === "development"
            ? process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL
            : process.env.NEXT_PUBLIC_BACKEND_SERVER_URL ||
            process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL;

    if (!backendUrl) return null;

    return `${backendUrl.replace(/\/$/, "")}/api`;
};

export const API_BASE_URL = getBaseUrl();

export const getToken = () => {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem("token");
    } catch {
        return null;
    }
};

export const api = axios.create({
    baseURL: API_BASE_URL || "",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window === "undefined") {
            return Promise.reject(error);
        }

        const status = error?.response?.status;
        const message =
            error?.response?.data?.ERROR ||
            error?.response?.data?.message ||
            "Something went wrong";

        if (status === 401) {
            const publicRoutes = ["/", "/login", "/register"];
            const currentPath = window.location.pathname.toLowerCase();

            if (!publicRoutes.includes(currentPath)) {
                toast.error("Session expired. Please login again");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
            }
        } else if (status >= 400) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    profile: () => api.get("/auth/me"),
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    },
};

export const productAPI = {
    getProducts: (page = 1, limit = 20) =>
        api.get(`/products?page=${page}&limit=${limit}`),
    getProductById: (id) => api.get(`/products/${id}`),
    getAllProductsAdmin: () => api.get("/products/admin/all"),
    createProduct: (data) => api.post("/products", data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    toggleVisibility: (id) =>
        api.patch(`/products/${id}/visibility`),
};

export const cartAPI = {
    getCart: () => api.get("/cart"),
    addToCart: (productId, quantity = 1) =>
        api.post("/cart/add", { productId, quantity }),
    updateCartItem: (productId, quantity) =>
        api.put("/cart/update", { productId, quantity }),
    removeFromCart: (productId) =>
        api.delete(`/cart/remove/${productId}`),
};

export const userStatsAPI = {
    getStats: () => api.get("/user/stats"),
};

export const adminStatsAPI = {
    getStats: () => api.get("/admin/stats"),
};

export const orderAPI = {
    placeOrder: () => api.post("/orders/place"),
    getMyOrders: () => api.get("/orders/my"),
};

export const adminUsersAPI = {
    getAllUsers: () => api.get("/admin/users"),
};

export const adminOrdersAPI = {
    getAllOrders: () => api.get("/admin/orders"),
    updateOrderStatus: (orderId, status) =>
        api.patch(`/admin/orders/${orderId}/status`, { status }),
};
