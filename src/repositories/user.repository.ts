import prisma from '../lib/prisma.js';

export function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export function createUser(data: {
    email: string;
    password: string;
    name?: string;
}) {
    return prisma.user.create({ data });
}

export function findUserProfileById(id: number) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
