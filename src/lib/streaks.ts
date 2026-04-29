/**
 * Calculates the current streak of completions based on the frequency.
 * @param completions Array of ISO date strings ("YYYY-MM-DD")
 * @param frequency "daily" | "weekly" | "monthly"
 * @param todayStr Optional ISO date string for "today"
 */
export function calculateCurrentStreak(
    completions: string[],
    frequency: "daily" | "weekly" | "monthly" = "daily",
    todayStr?: string
): number {
    if (!completions || completions.length === 0) return 0;

    const today = todayStr ? new Date(todayStr) : new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize and sort unique completions (latest first)
    const sortedCompletions = Array.from(new Set(completions))
        .map(d => {
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date;
        })
        .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;

    if (frequency === "daily") {
        let checkDate = new Date(today);
        const isCompleted = (d: Date) => sortedCompletions.some(c => c.getTime() === d.getTime());

        // If today is not completed, check if yesterday was. 
        // If neither, the streak is broken.
        if (!isCompleted(checkDate)) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (!isCompleted(checkDate)) return 0;
        }

        while (isCompleted(checkDate)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }
    else if (frequency === "weekly") {
        // A weekly streak counts consecutive weeks that have at least one completion.
        // We normalize each completion to its Monday to group them by week.
        const getMonday = (d: Date) => {
            const date = new Date(d);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            const monday = new Date(date.setDate(diff));
            monday.setHours(0, 0, 0, 0);
            return monday.getTime();
        };

        const weekCompletionTimes = new Set(sortedCompletions.map(getMonday));
        let checkWeekMonday = getMonday(today);

        // If current week has no completions, check previous week
        if (!weekCompletionTimes.has(checkWeekMonday)) {
            const prevWeekDate = new Date(checkWeekMonday);
            prevWeekDate.setDate(prevWeekDate.getDate() - 7);
            checkWeekMonday = getMonday(prevWeekDate);
            if (!weekCompletionTimes.has(checkWeekMonday)) return 0;
        }

        while (weekCompletionTimes.has(checkWeekMonday)) {
            streak++;
            const prevWeekDate = new Date(checkWeekMonday);
            prevWeekDate.setDate(prevWeekDate.getDate() - 7);
            checkWeekMonday = getMonday(prevWeekDate);
        }
    }
    else if (frequency === "monthly") {
        // A monthly streak counts consecutive months that have at least one completion.
        const getMonthId = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
        const monthIds = new Set(sortedCompletions.map(getMonthId));

        let checkDate = new Date(today);
        checkDate.setDate(1); // Ensure we're at the start of the month to avoid wrapping issues
        let checkMonthId = getMonthId(checkDate);

        if (!monthIds.has(checkMonthId)) {
            checkDate.setMonth(checkDate.getMonth() - 1);
            checkMonthId = getMonthId(checkDate);
            if (!monthIds.has(checkMonthId)) return 0;
        }

        while (monthIds.has(checkMonthId)) {
            streak++;
            checkDate.setMonth(checkDate.getMonth() - 1);
            checkMonthId = getMonthId(checkDate);
        }
    }

    return streak;
}
