/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { productAPI } from "@/utils/api";
import { toast } from "react-hot-toast";
import {
    Search,
    Plus,
    Filter,
    Edit2,
    Trash2,
    Eye,
    EyeOff
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

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

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await productAPI.deleteProduct(id);
            toast.success("Product deleted");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const toggleVisibility = async (p) => {
        try {
            await productAPI.updateProduct(p.id, { isVisible: !p.isVisible });
            toast.success(`Product is now ${!p.isVisible ? 'visible' : 'hidden'}`);
            fetchProducts();
        } catch (error) {
            toast.error("Failed to update visibility");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            price: Number(form.price),
            stockQuantity: Number(form.stockQuantity),
        };

        try {
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
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Products
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Manage your product catalog and inventory
                    </p>
                </div>

                <Button onClick={openCreate} className="gap-2">
                    <Plus size={18} />
                    Add Product
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#111827]/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div className="relative w-full sm:w-72">
                    <Input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search products..."
                        icon={Search}
                        className="bg-gray-900/50"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setPage(1);
                        }}
                        className="bg-gray-900/50 border border-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 text-white"
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
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#111827]/50 backdrop-blur-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-75">Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                                    Loading products...
                                </TableCell>
                            </TableRow>
                        ) : paginatedProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                                    No products found
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProducts.map((p) => (
                                <TableRow key={p.id} className="group">
                                    <TableCell className="font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-800 overflow-hidden">
                                                <img
                                                    src={p.imageUrl}
                                                    alt={p.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{p.name}</span>
                                                <span className="text-xs text-gray-500 truncate max-w-50">{p.description}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{p.category}</Badge>
                                    </TableCell>
                                    <TableCell>₹{p.price}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{p.stockQuantity}</span>
                                            {p.stockQuantity < 10 && <Badge variant="warning">Low</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={p.isVisible ? "success" : "secondary"}>
                                            {p.isVisible ? "Visible" : "Hidden"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleVisibility(p)}
                                                title={p.isVisible ? "Hide Product" : "Show Product"}
                                            >
                                                {p.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(p)}
                                                title="Edit Product"
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDelete(p.id)}
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <span className="text-sm text-gray-400">
                    Page {page} of {totalPages || 1}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={editingProduct ? "Edit Product" : "Add New Product"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Name</label>
                        <Input
                            required
                            placeholder="Product name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            className="flex min-h-20 w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="Product description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Price (₹)</label>
                            <Input
                                required
                                type="number"
                                placeholder="0.00"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Stock</label>
                            <Input
                                required
                                type="number"
                                placeholder="0"
                                value={form.stockQuantity}
                                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Image URL</label>
                        <Input
                            required
                            placeholder="https://..."
                            value={form.imageUrl}
                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Category</label>
                        <select
                            className="flex h-10 w-full rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                            <option>BOOKS</option>
                            <option>CLOTHING</option>
                            <option>ELECTRONICS</option>
                            <option>ACCESSORIES</option>
                            <option>FOOTWEAR</option>
                            <option>HOME</option>
                            <option>STATIONERY</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingProduct ? "Update Product" : "Create Product"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
