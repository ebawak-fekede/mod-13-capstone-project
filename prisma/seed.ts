import bcrypt from 'bcrypt';
import 'dotenv/config';

import prisma from '../src/lib/prisma.js';

async function main() {
    const email = 'demo@example.com';
    const password = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            name: 'Demo User',
            categories: {
                create: [{ name: 'Work' }, { name: 'Personal' }],
            },
        },
        include: { categories: true },
    });

    const [work, personal] = user.categories;

    await prisma.task.createMany({
        data: [
            {
                title: 'Finish capstone',
                description: 'Complete Task API requirements',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                userId: user.id,
                categoryId: work?.id,
            },
            {
                title: 'Buy groceries',
                description: 'Milk, eggs, bread',
                status: 'OPEN',
                priority: 'LOW',
                userId: user.id,
                categoryId: personal?.id,
            },
        ],
        skipDuplicates: true,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (err) => {
        console.error(err);
        await prisma.$disconnect();
        process.exit(1);
    });
