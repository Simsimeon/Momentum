import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '../streaks';

describe('calculateCurrentStreak', () => {
  it('should return 0 for empty completions', () => {
    expect(calculateCurrentStreak([], 'daily')).toBe(0);
  });

  it('should calculate daily streak correctly', () => {
    const today = '2026-04-29';
    const completions = ['2026-04-29', '2026-04-28', '2026-04-27'];
    expect(calculateCurrentStreak(completions, 'daily', today)).toBe(3);
  });

  it('should handle gap in daily streak', () => {
    const today = '2026-04-29';
    const completions = ['2026-04-29', '2026-04-27']; // Gap on 28th
    expect(calculateCurrentStreak(completions, 'daily', today)).toBe(1);
  });

  it('should maintain streak if today is not yet completed but yesterday was', () => {
    const today = '2026-04-29';
    const completions = ['2026-04-28', '2026-04-27'];
    expect(calculateCurrentStreak(completions, 'daily', today)).toBe(2);
  });

  it('should return 0 if neither today nor yesterday was completed', () => {
    const today = '2026-04-29';
    const completions = ['2026-04-27'];
    expect(calculateCurrentStreak(completions, 'daily', today)).toBe(0);
  });

  it('should calculate weekly streak correctly', () => {
    // Weeks: April 27 - May 3 (Monday to Sunday)
    // April 20 - April 26
    const today = '2026-04-29'; // Wednesday
    const completions = ['2026-04-29', '2026-04-22']; // One in current week, one in prev week
    expect(calculateCurrentStreak(completions, 'weekly', today)).toBe(2);
  });

  it('should calculate monthly streak correctly', () => {
    const today = '2026-04-29';
    const completions = ['2026-04-15', '2026-03-10'];
    expect(calculateCurrentStreak(completions, 'monthly', today)).toBe(2);
  });
});
