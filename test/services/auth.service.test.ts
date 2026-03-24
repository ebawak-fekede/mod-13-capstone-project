import { describe, expect, it, vi } from 'vitest';

import { HttpError } from '../../src/lib/http-error.js';
import { loginUser, registerUser } from '../../src/services/auth.service.js';

vi.mock('../../src/repositories/user.repository.js', () => {
    return {
        createUser: vi.fn(),
        findUserByEmail: vi.fn(),
    };
});

vi.mock('../../src/lib/jwt.js', () => {
    return {
        generateToken: vi.fn(() => 'token'),
    };
});

const userRepo = await import('../../src/repositories/user.repository.js');

describe('auth.service', () => {
    it('registers a user and returns token', async () => {
        vi.mocked(userRepo.findUserByEmail).mockResolvedValueOnce(null as any);
        vi.mocked(userRepo.createUser).mockResolvedValueOnce({
            id: 1,
            email: 'a@b.com',
            name: 'A',
        } as any);

        const result = await registerUser({
            email: 'a@b.com',
            password: 'secret',
            name: 'A',
        });

        expect(result.user.email).toBe('a@b.com');
        expect(result.token).toBe('token');
    });

    it('rejects register when user exists', async () => {
        vi.mocked(userRepo.findUserByEmail).mockResolvedValueOnce({
            id: 1,
        } as any);

        const promise = registerUser({ email: 'a@b.com', password: 'secret' });

        await expect(promise).rejects.toBeInstanceOf(HttpError);
        await expect(promise).rejects.toMatchObject({
            status: 409,
        });
    });

    it('rejects login when user missing', async () => {
        vi.mocked(userRepo.findUserByEmail).mockResolvedValueOnce(null as any);
        await expect(
            loginUser({ email: 'a@b.com', password: 'secret' }),
        ).rejects.toMatchObject({
            status: 401,
        });
    });
});
