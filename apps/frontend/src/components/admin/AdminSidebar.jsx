import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut } from 'lucide-react';
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Users', href: '/admin/users' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-[#0B0F19]">
            <div className="flex h-16 items-center border-b border-gray-800 px-6">
                <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    AdminPanel
                </h1>
            </div>

            <nav className="space-y-1 p-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-400"
                                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-100"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-4 left-0 w-full px-4">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
