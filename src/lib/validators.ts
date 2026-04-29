function validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Name is required");
    if (trimmed.length < 3) throw new Error("Name must be at least 3 characters long");
    if (trimmed.length > 60) throw new Error("Name must be at most 60 characters long");
    return trimmed;
}

export default validateName