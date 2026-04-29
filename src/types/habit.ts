type Habit = {
    id: string;
    name: string;
    description: string;
    userId: string;
    status: string;
    frequency: "daily" | "weekly" | "monthly";
    createdAt: string;
    completions: string[];
}

export type { Habit }