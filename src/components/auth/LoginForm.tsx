"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

type FormData = {
    email: string;
    password: string;
};

export default function LoginForm() {
    const [serverError, setServerError] = useState("");
    const { login } = useAuthStore();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        setServerError("");
        const res = login(data.email, data.password);
        if (res.success) {
            router.push("/");
        } else {
            setServerError(res.message);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="card-premium relative overflow-hidden">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white mb-6">
                        <CheckCircle2 size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to continue your progress</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                type="email"
                                placeholder="name@example.com"
                                data-testid="auth-login-email"
                                className={`input-premium pl-12 placeholder:pl-6 ${errors.email ? "border-red-300 ring-1 ring-red-50" : ""}`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...register("password", { required: "Password is required" })}
                                type="password"
                                placeholder="••••••••"
                                data-testid="auth-login-password"
                                className={`input-premium pl-12 placeholder:pl-6 ${errors.password ? "border-red-300 ring-1 ring-red-50" : ""}`}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
                    </div>

                    {serverError && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm animate-fade-in">
                            <AlertCircle size={16} />
                            <span className="font-medium">{serverError}</span>
                        </div>
                    )}

                    <button type="submit" data-testid="auth-login-submit" className="button-premium w-full flex items-center justify-center gap-2 mt-4 group">
                        Sign In
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Link
                        href="/auth/signup"
                        className="text-sm text-gray-500 hover:text-black transition-colors"
                    >
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
