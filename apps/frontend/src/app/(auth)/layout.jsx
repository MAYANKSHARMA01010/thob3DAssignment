export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0B0F19]">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2" />

            <div className="relative z-10 w-full max-w-md px-4 py-8">
                {children}
            </div>
        </div>
    );
}
