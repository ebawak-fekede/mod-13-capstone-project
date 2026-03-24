import { describe, expect, it } from 'vitest';
import { generateToken, verifyToken } from '../src/lib/jwt.js';

describe('JWT utils', () => {
  it('generates and verifies a token payload', () => {
    const token = generateToken({ userId: 42 });
    const decoded = verifyToken(token);

    expect(decoded.userId).toBe(42);
  });

  it('returns null for invalid tokens', () => {
    const decoded = verifyToken('not-a-valid-token');
    expect(decoded).toBeNull();
  });
});
