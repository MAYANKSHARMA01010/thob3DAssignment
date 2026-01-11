import { Bell, Search } from 'lucide-react';
import { Input } from '../ui/input';

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-800 bg-[#0B0F19]/80 px-6 backdrop-blur-sm">
            <div className="flex flex-1 items-center gap-4">
                <div className="w-full max-w-md">
                    <Input
                        placeholder="Search..."
                        icon={Search}
                        className="w-full bg-gray-900/50 border-gray-800 focus:border-indigo-500/50"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                </button>
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-medium text-indigo-400">
                    A
                </div>
            </div>
        </header>
    );
}
