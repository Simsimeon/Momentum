const getHabitSlug = (name: string): string => {
    try {
        if (!name) throw new Error("Habit name cannot be empty");
        if (name.length < 3 || name.length > 60) throw new Error("Habit name must be between 3 and 60 characters");
        const slug = name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z-]/gi, "")
            .trim();
        return slug;
    }
    catch (error) {
        throw error

    }
}

export default getHabitSlug
