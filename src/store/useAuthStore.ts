import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Session } from "@/types/auth";

type AuthStore = {
    user: User | null;
    session: Session | null;
    users: User[]; // Local simulation of a database
    login: (email: string, password: string) => { success: boolean; message: string };
    signup: (user: Omit<User, "id" | "createdAt">) => { success: boolean; message: string };
    logout: () => void;
}

const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            users: [],
            login: (email, password) => {
                const user = get().users.find(u => u.email === email && u.password === password);
                if (user) {
                    const session = { userId: user.id, email: user.email, name: user.name };
                    set({ user, session });
                    return { success: true, message: "Logged in successfully" };
                }
                return { success: false, message: "Invalid email or password" };
            },
            signup: (userData) => {
                const exists = get().users.find(u => u.email === userData.email);
                if (exists) return { success: false, message: "User already exists" };

                const newUser: User = {
                    ...userData,
                    id: Math.random().toString(36).substring(7),
                    createdAt: new Date().toISOString()
                };

                set((state) => ({
                    users: [...state.users, newUser],
                    user: newUser,
                    session: { userId: newUser.id, email: newUser.email, name: newUser.name }
                }));
                return { success: true, message: "Account created successfully" };
            },

            logout: () => set({ user: null, session: null }),
        }),
        {
            name: "habit-tracker-users",
        }
    )
);

export default useAuthStore;
