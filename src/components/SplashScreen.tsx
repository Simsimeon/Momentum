"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SplashScreen() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F5F5]"
            data-testid="splash-screen"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.6,
                    ease: [0, 0.71, 0.2, 1.01],
                    scale: {
                        type: "spring",
                        damping: 12,
                        stiffness: 100,
                        restDelta: 0.001
                    }
                }}
                className="flex flex-col items-center gap-4"
            >
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border-2 border-dashed border-gray-300 rounded-full"
                    />
                    <CheckCircle2 size={64} className="text-black" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-black mt-4">
                    Momentum
                </h1>
                <p className="text-gray-400 font-light tracking-widest text-sm">
                    Track your journey
                </p>
            </motion.div>
        </motion.div>
    );
}
