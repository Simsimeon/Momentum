"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogOut, CheckCircle2, TrendingUp, Calendar } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import useHabitStore from "@/store/useHabitStore";
import getHabitSlug from "@/lib/slug";
import validateName from "@/lib/validators";
import HabitCard from "./EditHabitCard";
import EmptyHabit from "./EmptyHabit";
import LogOutBtn from "@/components/ui/LogOutBtn";

type HabitFormData = {
    name: string;
    description: string;
    frequency: "daily" | "weekly" | "monthly";
};

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const { habits, addHabit } = useHabitStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isCreateHabitClicked, setIsCreateHabitClicked] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<HabitFormData>({
        defaultValues: {
            frequency: "daily"
        }
    });

    const [dateString, setDateString] = useState("");

    useEffect(() => {
        setDateString(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        return () => setServerError("");
    }, []);


    const userHabits = habits.filter(h => h.userId === user?.id);
    const today = new Date().toISOString().split("T")[0];
    const completedToday = userHabits.filter(h => h.completedDays.includes(today)).length;

    const [serverError, setServerError] = useState("");

    const onAddHabit = (data: HabitFormData) => {
        setServerError("");
        if (user) {
            try {
                // We call getHabitSlug here to catch any validation errors before calling the store
                // const slug = getHabitSlug(data.name);
                const validateNameInput = validateName(data.name);
                const res = addHabit(user.id, validateNameInput, data.description, data.frequency);

                if (res.success) {
                    reset();
                    setIsAdding(false);
                    setIsCreateHabitClicked(false);
                } else {
                    setServerError(res.message);
                }
            } catch (error: any) {
                setServerError(error.message || "An unexpected error occurred");
            }
        }
    };



    return (
        <main data-testid="dashboard-page" className="min-h-screen bg-[#F5F5F5] p-6 pb-24">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
                            <CheckCircle2 size={20} />
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight">Momentum</h1>
                    </div>
                    <LogOutBtn onLogout={logout} />

                </header>

                {/* Welcome Card */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-gray-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2">Today's Focus</p>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Hi, {user?.name}
                        </h2>

                        <div className="flex gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-2xl text-black">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Completed</p>
                                    <p className="text-lg font-bold">{completedToday}/{userHabits.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-2xl text-black">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Current Date</p>
                                    <p className="text-lg font-bold">
                                        {dateString}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-gray-50 rounded-full blur-3xl -z-0" />
                </section>

                {/* Habit List */}
                <section className="space-y-4"
                // data-testid={`habit-card-${}`}
                >
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-semibold text-gray-900">Your Habits</h3>
                        <span className="text-xs text-gray-400 font-medium">{userHabits.length} Total</span>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {userHabits.length > 0 ? (
                                userHabits.map((habit) => (
                                    <HabitCard
                                        key={habit.id}
                                        habitId={habit.id}
                                        name={habit.name || ""}
                                        description={habit.description}
                                        frequency={habit.frequency}
                                        completedDays={habit.completedDays}
                                    />

                                ))
                            ) : <EmptyHabit />}
                        </AnimatePresence>
                    </div>
                </section>
            </div>

            {/* Floating Action Button / Add Form Area */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 pb-8 z-50 pointer-events-none">
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="card-premium mb-4 !p-4 pointer-events-auto shadow-2xl"
                        >
                            <form onSubmit={handleSubmit(onAddHabit)} className="flex flex-col w-full gap-4"
                                data-testid="habit-form"
                            >
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                                    <div>
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Habit Name</label>
                                        <input
                                            {...register("name", { required: "Habit name is required" })}
                                            autoFocus
                                            type="text"
                                            placeholder="e.g. Morning Run"
                                            data-testid="habit-name-input"
                                            className={`input-premium py-3 ${errors.name ? "border-red-300" : ""}`}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Description (Optional)</label>
                                        <input
                                            {...register("description", {
                                                maxLength: { value: 100, message: "Description must be under 100 characters" }
                                            })}
                                            type="text"
                                            placeholder="e.g. 5km around the park"
                                            className={`input-premium py-3 ${errors.description ? "border-red-300" : ""}`}
                                            data-testid="habit-description-input"
                                        />
                                        {errors.description && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.description.message}</p>}
                                    </div>


                                    <div>
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Frequency</label>
                                        <select
                                            {...register("frequency")}
                                            className="input-premium py-3 appearance-none bg-white cursor-pointer"
                                            data-testid="habit-frequency-select"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full pt-2">
                                    <button type="submit" className="button-premium flex-1"
                                        data-testid="habit-save-button"
                                    >
                                        Save Habit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsAdding(false); reset(); setServerError(""); setIsCreateHabitClicked(false) }}
                                        className="p-3 text-gray-400 hover:text-black transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {(errors.name || serverError) && (
                                    <p className="text-red-500 text-xs ml-1">
                                        {errors.name?.message || serverError}
                                    </p>
                                )}
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="pointer-events-auto">
                    <button
                        data-testid="crate-habit-button"
                        onClick={() => { setIsAdding(true); setIsCreateHabitClicked(true) }}
                        className={`${!isAdding ? 'flex' : 'hidden'} button-premium w-full shadow-2xl shadow-black/20 flex items-center justify-center gap-2 h-14`}
                    >
                        <Plus size={24} />
                        Create Habit
                    </button>
                </div>
            </div>
        </main>
    );
}
