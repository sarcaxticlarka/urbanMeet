import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying seed data...');

    const userCount = await prisma.user.count();
    const groupCount = await prisma.group.count();
    const eventCount = await prisma.event.count();
    const commentCount = await prisma.comment.count();
    const followCount = await prisma.follow.count();

    console.log(`Users: ${userCount}`);
    console.log(`Groups: ${groupCount}`);
    console.log(`Events: ${eventCount}`);
    console.log(`Comments: ${commentCount}`);
    console.log(`Follows: ${followCount}`);

    if (userCount >= 20 && groupCount >= 20 && eventCount >= 20 && commentCount > 0 && followCount > 0) {
        console.log('Verification SUCCESS: Data counts are within expected ranges.');
    } else {
        console.error('Verification FAILED: Data counts are lower than expected.');
        process.exit(1);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
