import { Router } from 'express'
import prisma from '../prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true, email: true, name: true, avatarUrl: true, coverUrl: true, bio: true, city: true, interests: true,
      _count: {
        select: {
          followers: true,
          following: true,
        }
      }
    }
  })
  res.json({ user, followerCount: user?._count.followers || 0, followingCount: user?._count.following || 0 })
})

router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = req.user
  const { name, avatarUrl, bio, city, interests } = req.body
  const data: any = {}
  if (name !== undefined) data.name = name
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl
  if (bio !== undefined) data.bio = bio
  if (city !== undefined) data.city = city
  if (interests !== undefined) data.interests = interests
  const updated = await prisma.user.update({ where: { id: user.id }, data })
  res.json({ user: updated })
})

export default router
