import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Modal = ({ isOpen, onClose, title, children, className }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={cn(
                                "relative w-full max-w-lg overflow-hidden rounded-xl bg-[#111827] border border-gray-800 shadow-2xl pointer-events-auto",
                                className
                            )}
                        >
                            <div className="flex items-center justify-between border-b border-gray-800 p-6">
                                <h2 className="text-lg font-semibold text-white">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export { Modal };
