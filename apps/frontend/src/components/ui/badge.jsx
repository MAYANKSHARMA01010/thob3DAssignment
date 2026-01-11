import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        secondary: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        destructive: 'bg-red-500/10 text-red-400 border-red-500/20',
        outline: 'text-gray-400 border-gray-700',
    };

    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            variants[variant],
            className
        )} {...props}>
            {children}
        </div>
    );
};

export { Badge };
