import { describe, it, expect } from 'vitest';
import getHabitSlug from '../slug';

describe('getHabitSlug', () => {
  it('should convert name to lowercase and replace spaces with dashes', () => {
    expect(getHabitSlug('Morning Run')).toBe('morning-run');
  });

  it('should remove special characters', () => {
    expect(getHabitSlug('Yoga & Meditation!')).toBe('yoga--meditation');
  });

  it('should throw error for empty name', () => {
    expect(() => getHabitSlug('')).toThrow('Habit name cannot be empty');
  });

  it('should throw error for short name', () => {
    expect(() => getHabitSlug('Go')).toThrow('Habit name must be between 3 and 60 characters');
  });

  it('should handle leading/trailing spaces', () => {
    expect(getHabitSlug('  Study Time  ')).toBe('-study-time-');
  });
});
