import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 border border-transparent',
        secondary: 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700',
        outline: 'bg-transparent text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-white',
        ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
        destructive: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
