import { Router } from 'express'
import prisma from '../prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// List groups with optional city and search query
router.get('/', async (req, res) => {
  const { city, search, page = '1', limit = '20' } = req.query as any
  const where: any = {}

  if (city) where.city = String(city)

  // Enhanced multi-token search across name, description, city
  if (search) {
    const raw = String(search).trim()
    const tokens = raw.split(/\s+/).filter(Boolean)
    const orConditions: any[] = []
    tokens.forEach(tok => {
      orConditions.push(
        { name: { contains: tok } },
        { description: { contains: tok } },
        { city: { contains: tok } }
      )
    })
    // Full phrase matches
    orConditions.push(
      { name: { contains: raw } },
      { description: { contains: raw } },
      { city: { contains: raw } }
    )
    where.OR = orConditions
  }

  const take = Math.min(100, Number(limit) || 20)
  const skip = (Number(page) - 1) * take
  // Get total count for pagination
  const total = await prisma.group.count({ where })
  let groups = await prisma.group.findMany({ where, skip, take, include: { owner: true, members: true } })

  // Fallback related groups if search provided and no matches
  let relatedGroups: any[] | undefined = undefined
  if (search && groups.length === 0) {
    const firstTok = String(search).trim().split(/\s+/)[0]
    if (firstTok) {
      relatedGroups = await prisma.group.findMany({
        where: {
          OR: [
            { name: { contains: firstTok } },
            { description: { contains: firstTok } },
            { city: { contains: firstTok } }
          ]
        },
        take: 10,
        include: { owner: true, members: true }
      })
    }
  }

  res.json({
    groups,
    relatedGroups,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take)
    }
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const group = await prisma.group.findUnique({ where: { id }, include: { owner: true, members: { include: { user: true } }, events: true } })
  if (!group) return res.status(404).json({ error: 'Not found' })
  res.json({ group })
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { name, description, city, coverImage } = req.body
  const ownerId = req.user.id
  const group = await prisma.group.create({ data: { name, description, city, coverImage, ownerId } })
  // add owner as admin member
  await prisma.groupMember.create({ data: { groupId: group.id, userId: ownerId, role: 'admin' } })
  res.json({ group })
})

router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const group = await prisma.group.findUnique({ where: { id } })
  if (!group) return res.status(404).json({ error: 'Not found' })
  if (group.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
  const data: any = req.body
  const updated = await prisma.group.update({ where: { id }, data })
  res.json({ group: updated })
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const group = await prisma.group.findUnique({ where: { id } })
  if (!group) return res.status(404).json({ error: 'Not found' })
  if (group.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
  await prisma.group.delete({ where: { id } })
  res.json({ ok: true })
})

router.post('/:id/join', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const userId = req.user.id
  const exists = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: id } } }).catch(() => null)
  if (exists) return res.status(400).json({ error: 'Already a member' })
  const member = await prisma.groupMember.create({ data: { userId, groupId: id, role: 'member' } })
  res.json({ member })
})

router.post('/:id/leave', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const userId = req.user.id
  await prisma.groupMember.delete({ where: { userId_groupId: { userId, groupId: id } } }).catch(() => null)
  res.json({ ok: true })
})

// Follow a group: if not a member, create a membership with role 'follower'
router.post('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const userId = req.user.id
  const existing = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: id } } }).catch(() => null)
  if (existing) {
    // if already a member, no change; following is implied
    return res.json({ member: existing })
  }
  const follower = await prisma.groupMember.create({ data: { userId, groupId: id, role: 'follower' } })
  res.json({ follower })
})

// Unfollow a group: if role is follower (not member/admin), remove entry; otherwise keep membership
router.post('/:id/unfollow', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const userId = req.user.id
  const existing = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: id } } }).catch(() => null)
  if (!existing) return res.json({ ok: true })
  if (existing.role === 'follower') {
    await prisma.groupMember.delete({ where: { userId_groupId: { userId, groupId: id } } })
  }
  res.json({ ok: true })
})

export default router
