import { describe, it, expect } from 'vitest';
import validateName from '../validators';

describe('validateName', () => {
  it('should return trimmed name for valid input', () => {
    expect(validateName('  Read Book  ')).toBe('Read Book');
  });

  it('should throw error for empty name', () => {
    expect(() => validateName('')).toThrow('Name is required');
  });

  it('should throw error for name with only spaces', () => {
    expect(() => validateName('   ')).toThrow('Name is required');
  });

  it('should throw error for name too short', () => {
    expect(() => validateName('Ab')).toThrow('Name must be at least 3 characters long');
  });

  it('should throw error for name too long', () => {
    const longName = 'a'.repeat(61);
    expect(() => validateName(longName)).toThrow('Name must be at most 60 characters long');
  });

  it('should accept name exactly 3 characters long', () => {
    expect(validateName('abc')).toBe('abc');
  });

  it('should accept name exactly 60 characters long', () => {
    const sixtyChars = 'a'.repeat(60);
    expect(validateName(sixtyChars)).toBe(sixtyChars);
  });
});
