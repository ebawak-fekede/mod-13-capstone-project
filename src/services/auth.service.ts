import bcrypt from 'bcrypt';

import { HttpError } from '../lib/http-error.js';
import { generateToken } from '../lib/jwt.js';
import {
    createUser,
    findUserByEmail,
} from '../repositories/user.repository.js';

export async function registerUser(input: {
    email: string;
    password: string;
    name?: string;
}) {
    const existingUser = await findUserByEmail(input.email);
    if (existingUser) throw new HttpError(409, 'User already exists');

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await createUser({
        email: input.email,
        password: hashedPassword,
        name: input.name,
    });
    const token = generateToken({ userId: user.id });

    return {
        user: { id: user.id, email: user.email, name: user.name },
        token,
    };
}

export async function loginUser(input: { email: string; password: string }) {
    const user = await findUserByEmail(input.email);
    if (!user) throw new HttpError(401, 'Invalid credentials');

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) throw new HttpError(401, 'Invalid credentials');

    const token = generateToken({ userId: user.id });
    return {
        user: { id: user.id, email: user.email, name: user.name },
        token,
    };
}
