"use client";

import { useAuth } from "@/context/AuthContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto py-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>View your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4 bg-[#111827]/50 p-4 rounded-lg border border-gray-800">
                        <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Full Name</p>
                            <p className="font-medium text-white">{user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#111827]/50 p-4 rounded-lg border border-gray-800">
                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Email Address</p>
                            <p className="font-medium text-white">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#111827]/50 p-4 rounded-lg border border-gray-800">
                        <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Account Role</p>
                            <p className="font-medium text-white uppercase tracking-wider text-sm">{user?.role}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
