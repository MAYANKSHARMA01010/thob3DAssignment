import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, icon: Icon, trend, trendValue, className }) => {
    return (
        <Card className={cn("bg-[#111827]/50 backdrop-blur-xl border-gray-800", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                    {title}
                </CardTitle>
                {Icon && <Icon className="h-4 w-4 text-gray-500" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                {(trend || trendValue) && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {trend === 'up' && <span className="text-emerald-500">↑ {trendValue}</span>}
                        {trend === 'down' && <span className="text-red-500">↓ {trendValue}</span>}
                        <span className="opacity-70">from last month</span>
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export { StatCard };
