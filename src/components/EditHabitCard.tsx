"use client";

import { Children, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Pencil, X, Save } from "lucide-react";
import useHabitStore from "@/store/useHabitStore";
import getHabitSlug from "@/lib/slug";
import validateName from "@/lib/validators"
import { calculateCurrentStreak } from "@/lib/streaks";
import Modal from "./ui/Modal"
interface HabitCardProps {
    habitId: string;
    name: string;
    description?: string;
    frequency?: "daily" | "weekly" | "monthly";
    completedDays: string[];
}

export default function HabitCard({ habitId, name, description, frequency = "daily", completedDays }: HabitCardProps) {
    const { toggleHabit, deleteHabit, editHabit } = useHabitStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const [newDescription, setNewDescription] = useState(description || "");
    const [error, setError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const today = new Date().toISOString().split("T")[0];
    const isCompletedToday = completedDays.includes(today);
    const slug = getHabitSlug(name)
    const streak = calculateCurrentStreak(completedDays, frequency);
    const streakUnit = frequency === "daily" ? "DAY" : frequency === "weekly" ? "WEEK" : "MONTH";

    const handleSave = () => {
        setError("");
        try {
            // Validate first
            validateName(newName);
            editHabit(habitId, newName, newDescription);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || "Invalid name");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewName(name);
        setNewDescription(description || "");
        setError("");
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium flex flex-col gap-2 group"
            >
                <div className=" flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                        <button
                            onClick={() => toggleHabit(habitId, today)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 mt-1 ${isCompletedToday
                                ? "bg-black text-white shadow-lg shadow-black/20"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                }`}
                        >
                            <Check size={20} strokeWidth={3} />
                        </button>

                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.div
                                        key="edit"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="flex flex-col gap-2 w-full"
                                    >
                                        <input
                                            autoFocus
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                            placeholder="Habit name"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                        />
                                        <input
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                            placeholder="Description (optional)"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[12px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div key="display">
                                        <div className="flex items-center gap-2 mb-0.5"
                                            data-testid={`habit-edit-${slug}`}
                                        >
                                            <h3 className={`font-semibold truncate transition-all ${isCompletedToday ? "text-gray-400 line-through" : "text-gray-900"}`}>
                                                {name}
                                            </h3>
                                            {frequency && (
                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                                    {frequency}
                                                </span>
                                            )}
                                        </div>
                                        {description && (
                                            <p className="text-sm text-gray-500 line-clamp-1 mb-1">
                                                {description}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-gray-400 font-medium">
                                            {streak} {streakUnit}{streak !== 1 ? "S" : ""} STREAK
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>


                    <div className="flex items-center gap-1">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <Save size={18} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    data-testid={`habit-edit-btn-${slug}`}
                                    className="p-2 text-gray-300 hover:text-black opacity-100 group-hover:opacity-100 transition-all rounded-lg"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    data-testid={`habit-delete-btn-${slug}`}
                                    className="p-2 text-gray-300 hover:text-red-500 opacity-100 group-hover:opacity-100 transition-all rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {error && isEditing && (
                    <p className="text-[10px] text-red-500 font-medium ml-14 animate-fade-in">
                        {error}
                    </p>
                )}
            </motion.div>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <Modal name={name} habitId={habitId} isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} />
                )}
            </AnimatePresence>
        </>
    );
}
