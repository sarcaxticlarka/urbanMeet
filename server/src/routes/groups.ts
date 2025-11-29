import { Router } from 'express'
import prisma from '../prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// List groups with optional city and search query
router.get('/', async (req, res) => {
  const { city, search, page = '1', limit = '20' } = req.query as any
  const where: any = {}
  if (city) where.city = String(city)
  if (search) where.OR = [{ name: { contains: String(search), mode: 'insensitive' } }, { description: { contains: String(search), mode: 'insensitive' } }]
  const take = Math.min(100, Number(limit) || 20)
  const skip = (Number(page) - 1) * take
  const groups = await prisma.group.findMany({ where, skip, take, include: { owner: true, members: true } })
  res.json({ groups })
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

export default router
