import axios from "axios";

export const getBaseUrl = () => {
    const backendUrl =
        process.env.NODE_ENV === "development"
            ? process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL
            : process.env.NEXT_PUBLIC_BACKEND_SERVER_URL ||
              process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL;

    if (!backendUrl) {
        console.warn("Backend URL not configured");
        return null;
    }

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
        if (
            error?.response?.status === 401 &&
            typeof window !== "undefined"
        ) {
            const publicRoutes = ["/login", "/register"];
            const currentPath = window.location.pathname.toLowerCase();

            if (!publicRoutes.includes(currentPath)) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    profile: () => api.get("/auth/me"),
    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
    },
};

export const productAPI = {
    getProducts: () => api.get("/products"),
    getProductById: (id) => api.get(`/products/${id}`),
    getAllProductsAdmin: () => api.get("/products/admin/all"),
    createProduct: (data) => api.post("/products", data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    toggleVisibility: (id) =>
        api.patch(`/products/${id}/visibility`),
};
