"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { productAPI } from "@/utils/api";
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const emptyForm = {
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "BOOKS",
    stockQuantity: "",
};

export default function AdminProductsPage() {
    const searchParams = useSearchParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [page, setPage] = useState(1);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productAPI.getAllProductsAdmin();
            setProducts(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchParams.get("create") === "true") {
            openCreate();
        }
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = p.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "ALL" ||
                p.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const paginatedProducts = filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const openCreate = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (p) => {
        setEditingProduct(p);
        setForm({
            name: p.name,
            description: p.description || "",
            price: p.price,
            imageUrl: p.imageUrl,
            category: p.category,
            stockQuantity: p.stockQuantity,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            price: Number(form.price),
            stockQuantity: Number(form.stockQuantity),
        };

        if (editingProduct) {
            await productAPI.updateProduct(editingProduct.id, payload);
            toast.success("Product updated");
        } else {
            await productAPI.createProduct(payload);
            toast.success("Product created");
        }

        setShowForm(false);
        setEditingProduct(null);
        setForm(emptyForm);
        fetchProducts();
    };

    if (loading) return <p className="text-gray-400">Loading...</p>;

    return (
        <div className="space-y-6 text-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Products
                    </h1>
                    <p className="text-gray-400">
                        Manage your catalog
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="bg-white text-black px-4 py-2 hover:bg-gray-200 transition"
                >
                    + Add Product
                </button>
            </div>

            <div className="flex flex-wrap gap-4">
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Search product..."
                    className="bg-black border border-gray-800 px-3 py-2 text-sm text-white"
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setPage(1);
                    }}
                    className="bg-black border border-gray-800 px-3 py-2 text-sm text-white"
                >
                    <option value="ALL">All Categories</option>
                    <option>BOOKS</option>
                    <option>CLOTHING</option>
                    <option>ELECTRONICS</option>
                    <option>ACCESSORIES</option>
                    <option>FOOTWEAR</option>
                    <option>HOME</option>
                    <option>STATIONERY</option>
                </select>
            </div>

            <div className="border border-gray-800 rounded-lg overflow-hidden bg-[#0f0f0f]">
                <table className="w-full text-sm">
                    <thead className="bg-[#161616] text-gray-400">
                        <tr>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-center">Price</th>
                            <th className="p-3 text-center">Stock</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map((p) => (
                            <tr
                                key={p.id}
                                className="border-t border-gray-800 hover:bg-[#1a1a1a]"
                            >
                                <td className="p-3 text-white">
                                    {p.name}
                                </td>
                                <td className="p-3 text-center">
                                    ₹{p.price}
                                </td>
                                <td className="p-3 text-center">
                                    {p.stockQuantity}
                                </td>
                                <td className="p-3 text-center">
                                    {p.isVisible ? "Visible" : "Hidden"}
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() =>
                                                toggleVisibility(p)
                                            }
                                            className="border border-gray-700 px-2 py-1 text-xs hover:bg-gray-800"
                                        >
                                            {p.isVisible
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                        <button
                                            onClick={() => openEdit(p)}
                                            className="border border-gray-700 px-2 py-1 text-xs hover:bg-gray-800"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(p.id)
                                            }
                                            className="border border-red-800 text-red-400 px-2 py-1 text-xs hover:bg-red-900/20"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {paginatedProducts.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-4 text-center text-gray-400"
                                >
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center gap-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="border border-gray-700 px-3 py-1 disabled:opacity-40"
                >
                    Prev
                </button>

                <span className="text-sm text-gray-400">
                    Page {page} of {totalPages || 1}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="border border-gray-700 px-3 py-1 disabled:opacity-40"
                >
                    Next
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#0f0f0f] border border-gray-800 w-full max-w-lg p-6 space-y-4"
                    >
                        <h2 className="text-lg font-semibold text-white">
                            {editingProduct
                                ? "Edit Product"
                                : "Add Product"}
                        </h2>

                        <input
                            name="name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            className="border border-gray-800 bg-black p-2 w-full text-white"
                            placeholder="Product name"
                            required
                        />

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className="border border-gray-800 bg-black p-2 w-full text-white"
                            placeholder="Description"
                        />

                        <input
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    imageUrl: e.target.value,
                                })
                            }
                            className="border border-gray-800 bg-black p-2 w-full text-white"
                            placeholder="Image URL"
                            required
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        price: e.target.value,
                                    })
                                }
                                className="border border-gray-800 bg-black p-2 text-white"
                                placeholder="Price"
                                required
                            />
                            <input
                                type="number"
                                value={form.stockQuantity}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        stockQuantity: e.target.value,
                                    })
                                }
                                className="border border-gray-800 bg-black p-2 text-white"
                                placeholder="Stock"
                                required
                            />
                        </div>

                        <select
                            value={form.category}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category: e.target.value,
                                })
                            }
                            className="border border-gray-800 bg-black p-2 w-full text-white"
                        >
                            <option>BOOKS</option>
                            <option>CLOTHING</option>
                            <option>ELECTRONICS</option>
                            <option>ACCESSORIES</option>
                            <option>FOOTWEAR</option>
                            <option>HOME</option>
                            <option>STATIONERY</option>
                        </select>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="border border-gray-700 px-4 py-2 hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-white text-black px-4 py-2 hover:bg-gray-200"
                            >
                                {editingProduct ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
