import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (classname merger)', () => {
  it('menggabungkan class string biasa', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('mengabaikan nilai falsy', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar');
  });

  it('menyelesaikan konflik class Tailwind', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('menangani class kondisional', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });
});
