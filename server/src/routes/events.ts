import { Router } from 'express'
import prisma from '../prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/events?city=&from=&to=&category=
router.get('/', async (req, res) => {
  const { city, from, to, page = '1', limit = '20', owner } = req.query as any
  const where: any = {}
  if (city) where.city = String(city)
  if (from || to) where.startsAt = {}
  if (from) where.startsAt.gte = new Date(String(from))
  if (to) where.startsAt.lte = new Date(String(to))
  if (owner) {
    // owner = userId or 'me' with auth via Bearer token ignored here; for 'me' client should pass user id
    where.group = { ownerId: String(owner) }
  }
  const take = Math.min(100, Number(limit) || 20)
  const skip = (Number(page) - 1) * take
  const events = await prisma.event.findMany({ where, skip, take, include: { group: true, attendees: true } })
  res.json({ events })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const event = await prisma.event.findUnique({ where: { id }, include: { group: true, attendees: { include: { user: true } }, comments: { include: { user: true } } } })
  if (!event) return res.status(404).json({ error: 'Not found' })
  res.json({ event })
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const data = req.body
  if (!data.groupId || !data.title || !data.startsAt) return res.status(400).json({ error: 'groupId, title, startsAt required' })
  // Normalize tags to JSON array of strings
  let tags: any = undefined
  if (data.tags) {
    if (Array.isArray(data.tags)) tags = data.tags.filter(Boolean)
    else if (typeof data.tags === 'string') tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
  }
  const event = await prisma.event.create({
    data: {
      groupId: data.groupId,
      title: data.title,
      description: data.description,
      startsAt: new Date(data.startsAt),
      endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      venue: data.venue,
      address: data.address,
      city: data.city,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      imageUrl: data.imageUrl,
      tags,
    },
  })
  res.json({ event })
})

router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const body = req.body
  const data: any = {}
  if (body.title !== undefined) data.title = body.title
  if (body.description !== undefined) data.description = body.description
  if (body.startsAt) data.startsAt = new Date(body.startsAt)
  if (body.endsAt) data.endsAt = new Date(body.endsAt)
  if (body.venue !== undefined) data.venue = body.venue
  if (body.address !== undefined) data.address = body.address
  if (body.city !== undefined) data.city = body.city
  if (body.capacity !== undefined) data.capacity = Number(body.capacity)
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl
  if (body.tags !== undefined) {
    if (Array.isArray(body.tags)) data.tags = body.tags.filter(Boolean)
    else if (typeof body.tags === 'string') data.tags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
  }
  const updated = await prisma.event.update({ where: { id }, data })
  res.json({ event: updated })
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  await prisma.event.delete({ where: { id } })
  res.json({ ok: true })
})

router.post('/:id/rsvp', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const { status } = req.query as any // going | interested | cancelled
  const userId = req.user.id
  if (!['going', 'interested', 'cancelled'].includes(String(status))) return res.status(400).json({ error: 'Invalid status' })
  const payload = { userId, eventId: id, status: String(status) }
  const upsert = await prisma.eventAttendee.upsert({ where: { userId_eventId: { userId, eventId: id } }, create: payload, update: { status: String(status) } })
  res.json({ rsvp: upsert })
})

router.delete('/:id/rsvp', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const userId = req.user.id
  await prisma.eventAttendee.delete({ where: { userId_eventId: { userId, eventId: id } } }).catch(() => null)
  res.json({ ok: true })
})

export default router
