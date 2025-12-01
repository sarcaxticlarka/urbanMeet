import { Router } from 'express'
import prisma from '../prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true, 
      email: true, 
      name: true, 
      avatarUrl: true, 
      coverUrl: true, 
      bio: true, 
      city: true, 
      interests: true,
      _count: {
        select: {
          followers: true,
          following: true,
        }
      }
    }
  })
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  
  // Flatten the response to include counts directly in user object
  const userWithCounts = {
    ...user,
    followerCount: user._count.followers,
    followingCount: user._count.following,
    _count: undefined // Remove _count from response
  }
  
  res.json({ user: userWithCounts })
})

router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = req.user
  const { name, avatarUrl, bio, city, interests, coverUrl } = req.body
  const data: any = {}
  if (name !== undefined) data.name = name
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl
  if (coverUrl !== undefined) data.coverUrl = coverUrl
  if (bio !== undefined) data.bio = bio
  if (city !== undefined) data.city = city
  if (interests !== undefined) data.interests = interests
  const updated = await prisma.user.update({ where: { id: user.id }, data })
  res.json({ user: updated })
})

// GET /api/users/me/followers
router.get('/me/followers', requireAuth, async (req: AuthRequest, res) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: req.user.id },
    include: { follower: { select: { id: true, name: true, avatarUrl: true, bio: true } } }
  })
  res.json({ followers: followers.map(f => f.follower) })
})

// GET /api/users/me/following
router.get('/me/following', requireAuth, async (req: AuthRequest, res) => {
  const following = await prisma.follow.findMany({
    where: { followerId: req.user.id },
    include: { following: { select: { id: true, name: true, avatarUrl: true, bio: true } } }
  })
  res.json({ following: following.map(f => f.following) })
})

// GET /api/users - Get all users (for discover/follow suggestions)
router.get('/', async (req, res) => {
  const { search, limit = '20' } = req.query as any
  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: 'insensitive' } },
      { email: { contains: String(search), mode: 'insensitive' } },
      { bio: { contains: String(search), mode: 'insensitive' } }
    ]
  }
  const users = await prisma.user.findMany({
    where,
    take: Math.min(100, Number(limit)),
    select: { id: true, name: true, avatarUrl: true, bio: true, city: true }
  })
  res.json({ users })
})

// GET /api/users/:id - Get a specific user's public profile
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      coverUrl: true,
      bio: true,
      city: true,
      interests: true,
      _count: {
        select: {
          followers: true,
          following: true,
        }
      }
    }
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const userWithCounts = {
    ...user,
    followerCount: user._count.followers,
    followingCount: user._count.following,
  }

  // Remove prisma _count from response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _count, ...publicUser } = userWithCounts as any

  res.json({ user: publicUser })
})

// POST /api/users/:id/follow - Follow a user
router.post('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const followerId = req.user.id
  
  if (followerId === id) {
    return res.status(400).json({ error: 'Cannot follow yourself' })
  }
  
  // Check if already following
  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: id } }
  })
  
  if (existing) {
    return res.status(400).json({ error: 'Already following this user' })
  }
  
  const follow = await prisma.follow.create({
    data: { followerId, followingId: id }
  })
  
  // Create notification for the user being followed
  const follower = await prisma.user.findUnique({
    where: { id: followerId },
    select: { name: true }
  })
  
  await prisma.notification.create({
    data: {
      userId: id, // The person being followed gets the notification
      type: 'follow',
      message: `${follower?.name || 'Someone'} started following you`,
      data: {
        followerId: followerId,
        followerName: follower?.name
      }
    }
  })
  
  res.json({ follow })
})

// DELETE /api/users/:id/follow - Unfollow a user
router.delete('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const followerId = req.user.id
  
  await prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId: id } }
  }).catch(() => null)
  
  res.json({ ok: true })
})

export default router
