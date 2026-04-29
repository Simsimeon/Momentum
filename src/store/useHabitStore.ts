import { create } from "zustand";
import { persist } from "zustand/middleware";
import getHabitSlug from "../lib/slug";

export type Habit = {
    id: string;
    userId: string;
    name: string | null;
    description?: string;
    frequency: "daily" | "weekly" | "monthly";
    completedDays: string[]; // ISO dates
    createdAt: string;
}

type HabitStore = {
    habits: Habit[];
    editHabit: (habitId: string, name: string, description?: string) => void;
    addHabit: (userId: string, name: string, description?: string, frequency?: "daily" | "weekly" | "monthly") => { success: boolean; message: string };
    toggleHabit: (habitId: string, date: string) => void;
    deleteHabit: (habitId: string) => void;
}

const useHabitStore = create<HabitStore>()(
    persist(
        (set, get) => ({
            habits: [],
            addHabit: (userId, name, description, frequency = "daily") => {
                const newHabit: Habit = {
                    id: Math.random().toString(36).substring(7),
                    userId,
                    name: getHabitSlug(name),
                    description,
                    frequency,
                    completedDays: [],
                    createdAt: new Date().toISOString()
                };
                set((state) => ({ habits: [...state.habits, newHabit] }));
                return { success: true, message: "Habit added" };
            },

            toggleHabit: (habitId, date) => {
                set((state) => ({
                    habits: state.habits.map((h) => {
                        if (h.id === habitId) {
                            const isCompleted = h.completedDays.includes(date);
                            return {
                                ...h,
                                completedDays: isCompleted
                                    ? h.completedDays.filter((d) => d !== date)
                                    : [...h.completedDays, date]
                            };
                        }
                        return h;
                    })
                }));
            },
            editHabit: (habitId: string, name: string, description?: string) => {
                set((state) => ({
                    habits: state.habits.map((h) => {
                        if (h.id === habitId) {
                            return {
                                ...h,
                                name: getHabitSlug(name),
                                description
                            };
                        }
                        return h;
                    })
                }));
            },
            deleteHabit: (habitId) => {
                set((state) => ({
                    habits: state.habits.filter((h) => h.id !== habitId)
                }));
            }
        }),
        {
            name: "habit-tracker-habits",
        }
    )
);

export default useHabitStore;
