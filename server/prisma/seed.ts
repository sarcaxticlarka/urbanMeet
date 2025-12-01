import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Clean up existing data
    await prisma.comment.deleteMany();
    await prisma.eventAttendee.deleteMany();
    await prisma.event.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.user.deleteMany();

    console.log('Deleted existing data.');

    // Create 25 Users (20-30 range)
    const users = [];
    const defaultPassword = await bcrypt.hash('Password123!', 10); // Hashed password for all users
    for (let i = 0; i < 25; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: defaultPassword,
                name: faker.person.fullName(),
                avatarUrl: faker.image.avatar(),
                coverUrl: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
                // MySQL default varchar length may be ~191; keep bio concise
                bio: faker.lorem.paragraph().slice(0, 180),
                city: faker.location.city(),
                interests: faker.helpers.arrayElements([
                    'Music', 'Tech', 'Art', 'Food', 'Travel', 'Sports', 
                    'Photography', 'Reading', 'Gaming', 'Fitness', 
                    'Cooking', 'Dancing', 'Writing', 'Yoga', 'Hiking'
                ], { min: 2, max: 5 }),
            },
        });
        users.push(user);
    }
    console.log(`Created ${users.length} users.`);

    // Create 25 Groups (20-30 range)
    const groups = [];
    const groupNames = [
        'Tech Innovators', 'Art Enthusiasts', 'Food Lovers', 'Music Makers',
        'Fitness Warriors', 'Book Club', 'Photography Society', 'Travel Explorers',
        'Gaming Guild', 'Cooking Masters', 'Dance Crew', 'Writing Circle',
        'Yoga Community', 'Hiking Adventures', 'Startup Founders', 'Design Thinkers',
        'Music Producers', 'Film Buffs', 'Chess Players', 'Cycling Group',
        'Running Club', 'Volunteer Network', 'Language Exchange', 'Entrepreneurs Hub',
        'Creative Writers'
    ];
    
    for (let i = 0; i < 25; i++) {
        const owner = faker.helpers.arrayElement(users);
        const group = await prisma.group.create({
            data: {
                name: groupNames[i] || faker.company.name() + ' Group',
                // Keep description safely under typical VARCHAR(191) limits
                description: faker.lorem.sentences({ min: 3, max: 5 }).slice(0, 150),
                city: faker.location.city(),
                coverImage: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
                ownerId: owner.id,
            },
        });
        groups.push(group);

        // Add owner as admin member
        await prisma.groupMember.create({
            data: {
                userId: owner.id,
                groupId: group.id,
                role: 'admin',
            },
        });
    }
    console.log(`Created ${groups.length} groups.`);

    // Add Members to Groups (5-12 members per group)
    for (const group of groups) {
        const otherUsers = users.filter(u => u.id !== group.ownerId);
        const numMembers = faker.number.int({ min: 5, max: 12 });
        const members = faker.helpers.arrayElements(otherUsers, { min: numMembers, max: numMembers });
        for (const member of members) {
            await prisma.groupMember.create({
                data: {
                    userId: member.id,
                    groupId: group.id,
                    role: 'member',
                },
            });
        }
    }
    console.log('Added members to groups.');

    // Create 25 Events (20-30 range) - distribute across groups
    const events = [];
    const eventTitles = [
        'Tech Meetup & Networking', 'Art Gallery Opening', 'Food Festival', 'Live Music Night',
        'Fitness Bootcamp', 'Book Discussion', 'Photography Walk', 'Travel Planning Session',
        'Gaming Tournament', 'Cooking Workshop', 'Dance Class', 'Writing Workshop',
        'Yoga Retreat', 'Mountain Hiking', 'Startup Pitch Night', 'Design Critique',
        'Music Production Masterclass', 'Film Screening', 'Chess Tournament', 'Cycling Tour',
        'Marathon Training', 'Community Service Day', 'Language Practice', 'Business Networking',
        'Creative Writing Circle'
    ];
    
    // Create exactly 25 events, distributing them across groups
    for (let i = 0; i < 25; i++) {
        const group = groups[i % groups.length]; // Distribute events across all groups
        const startsAt = faker.date.future({ years: 1 });
        const endsAt = new Date(startsAt.getTime() + faker.number.int({ min: 2, max: 6 }) * 60 * 60 * 1000);
        const event = await prisma.event.create({
            data: {
                groupId: group.id,
                title: eventTitles[i] || faker.lorem.words(3),
                description: faker.lorem.sentences({ min: 3, max: 5 }).slice(0, 150),
                startsAt: startsAt,
                endsAt: endsAt,
                venue: faker.company.name(),
                address: faker.location.streetAddress({ useFullAddress: true }),
                city: group.city,
                capacity: faker.number.int({ min: 20, max: 200 }),
                imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
                tags: faker.helpers.arrayElements([
                    'Meetup', 'Workshop', 'Party', 'Seminar', 'Conference',
                    'Networking', 'Social', 'Educational', 'Entertainment'
                ], { min: 1, max: 3 }),
            },
        });
        events.push(event);
    }
    console.log(`Created ${events.length} events.`);

    // Add Attendees to Events (5-20 attendees per event)
    for (const event of events) {
        const numAttendees = faker.number.int({ min: 5, max: 20 });
        const attendees = faker.helpers.arrayElements(users, { min: numAttendees, max: numAttendees });
        for (const attendee of attendees) {
            await prisma.eventAttendee.create({
                data: {
                    userId: attendee.id,
                    eventId: event.id,
                    status: faker.helpers.arrayElement(['going', 'interested', 'going']), // More 'going' than 'interested'
                },
            });
        }
    }
    console.log('Added attendees to events.');

    // Create 25 Comments (20-30 range) - distribute across events
    const comments = [];
    const commentContents = [
        'Looking forward to this event!', 'Count me in!', 'This sounds amazing!',
        'Can\'t wait to meet everyone!', 'Great initiative!', 'I\'ll be there!',
        'Excited to join!', 'See you all there!', 'This is going to be fun!',
        'Perfect timing!', 'Love the idea!', 'Will definitely attend!',
        'Sounds interesting!', 'Looking forward to it!', 'Count me in!',
        'Can\'t wait!', 'This is great!', 'I\'m excited!', 'See you there!',
        'Perfect!', 'Amazing event!', 'Will be there!', 'Looking forward!',
        'Great!', 'Excited!'
    ];
    
    for (let i = 0; i < 25; i++) {
        const event = faker.helpers.arrayElement(events);
        const commenter = faker.helpers.arrayElement(users);
        const comment = await prisma.comment.create({
            data: {
                eventId: event.id,
                userId: commenter.id,
                content: commentContents[i] || faker.lorem.sentence(),
            },
        });
        comments.push(comment);
    }
    console.log(`Created ${comments.length} comments.`);

    // Create Follows (each user follows 3-8 others)
    for (const user of users) {
        const others = users.filter(u => u.id !== user.id);
        const numFollowing = faker.number.int({ min: 3, max: 8 });
        const following = faker.helpers.arrayElements(others, { min: numFollowing, max: numFollowing });
        for (const followTarget of following) {
            // Avoid duplicate follows
            const existing = await prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: user.id,
                        followingId: followTarget.id,
                    },
                },
            }).catch(() => null);
            
            if (!existing) {
                await prisma.follow.create({
                    data: {
                        followerId: user.id,
                        followingId: followTarget.id,
                    },
                });
            }
        }
    }
    console.log('Created follows.');

    // Summary
    const userCount = await prisma.user.count();
    const groupCount = await prisma.group.count();
    const eventCount = await prisma.event.count();
    const commentCount = await prisma.comment.count();
    const groupMemberCount = await prisma.groupMember.count();
    const eventAttendeeCount = await prisma.eventAttendee.count();
    const followCount = await prisma.follow.count();

    console.log('\n=== Seeding Summary ===');
    console.log(`Users: ${userCount}`);
    console.log(`Groups: ${groupCount}`);
    console.log(`Events: ${eventCount}`);
    console.log(`Comments: ${commentCount}`);
    console.log(`Group Members: ${groupMemberCount}`);
    console.log(`Event Attendees: ${eventAttendeeCount}`);
    console.log(`Follows: ${followCount}`);
    console.log('\nSeeding finished.');
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
