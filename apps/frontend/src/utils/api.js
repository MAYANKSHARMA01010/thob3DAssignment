import axios from "axios";

export const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return `${process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL}/api`;
    }

    const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_SERVER_URL ||
        process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL;

    return `${backendUrl.replace(/\/$/, "")}/api`;
};

export const API_BASE_URL = getBaseUrl();

export const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

export const api = axios.create({
    baseURL: API_BASE_URL,
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
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/Login")
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/Login";
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
    },
};
