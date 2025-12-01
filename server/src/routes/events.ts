import { Router } from 'express'
import prisma from '../prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/events?city=&from=&to=&category=&search=
router.get('/', async (req, res) => {
  const { city, from, to, page = '1', limit = '20', owner, search } = req.query as any
  const where: any = { AND: [] }

  // Date range filter
  if (from || to) {
    const dateFilter: any = {}
    if (from) dateFilter.gte = new Date(String(from))
    if (to) dateFilter.lte = new Date(String(to))
    where.AND.push({ startsAt: dateFilter })
  }

  // Owner filter
  if (owner) {
    where.AND.push({ group: { ownerId: String(owner) } })
  }

  // Enhanced search functionality: supports multi-token search across event fields and related group fields.
  // Also performs case-insensitive matching.
  if (search) {
    const raw = String(search).trim()
    const tokens = raw.split(/\s+/).filter(Boolean)
    const orConditions: any[] = []
    // For each token build OR conditions
    tokens.forEach(tok => {
      orConditions.push(
        { title: { contains: tok } },
        { description: { contains: tok } },
        { city: { contains: tok } },
        { venue: { contains: tok } },
        { address: { contains: tok } },
        { group: { name: { contains: tok } } },
        { group: { city: { contains: tok } } }
      )
    })
    // Single token full raw search too (helps for phrases)
    orConditions.push(
      { title: { contains: raw } },
      { description: { contains: raw } },
      { city: { contains: raw } },
      { venue: { contains: raw } },
      { address: { contains: raw } },
      { group: { name: { contains: raw } } },
      { group: { city: { contains: raw } } }
    )
    where.AND.push({ OR: orConditions })
  }

  // City filter (only if search is not provided, otherwise city is part of search domain)
  if (city && !search) {
    where.AND.push({ city: { contains: String(city) } })
  }

  // If no filters, remove the AND array
  const finalWhere = where.AND.length > 0 ? where : {}

  const take = Math.min(100, Number(limit) || 20)
  const skip = (Number(page) - 1) * take
  // Get total count for pagination
  const total = await prisma.event.count({ where: finalWhere })
  let events = await prisma.event.findMany({
    where: finalWhere,
    skip,
    take,
    include: { group: { include: { owner: true } }, attendees: true },
    orderBy: { startsAt: 'asc' }
  })

  // If search provided and no direct matches, attempt a broader related search using first token only.
  let relatedEvents: any[] | undefined = undefined
  if (search && events.length === 0) {
    const firstTok = String(search).trim().split(/\s+/)[0]
    if (firstTok) {
      relatedEvents = await prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: firstTok } },
            { description: { contains: firstTok } },
            { city: { contains: firstTok } },
            { group: { name: { contains: firstTok } } }
          ]
        },
        take: 10,
        include: { group: true },
        orderBy: { startsAt: 'asc' }
      })
    }
  }

  res.json({
    events,
    relatedEvents,
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
  const event = await prisma.event.findUnique({ 
    where: { id }, 
    include: { 
      group: { include: { owner: true } }, 
      attendees: { include: { user: true } }, 
      comments: { include: { user: true } } 
    } 
  })
  if (!event) return res.status(404).json({ error: 'Not found' })
  res.json({ event })
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const data = req.body
  // Allow auto-group creation: if groupId missing, create a lightweight group for this event owned by current user
  if (!data.title || !data.startsAt) return res.status(400).json({ error: 'title and startsAt required' })
  let groupId = data.groupId as string | undefined
  if (!groupId) {
    const ownerId = req.user.id
    const city = String(data.city || req.user.city || 'Unknown')
    const autoGroup = await prisma.group.create({
      data: {
        name: `${data.title} Group`,
        description: (data.description as string | undefined) || `Auto group for event: ${data.title}`,
        city,
        ownerId,
      },
    })
    // add owner as admin member
    await prisma.groupMember.create({ data: { groupId: autoGroup.id, userId: ownerId, role: 'admin' } })
    groupId = autoGroup.id
  }
  // Normalize tags to JSON array of strings
  let tags: any = undefined
  if (data.tags) {
    if (Array.isArray(data.tags)) tags = data.tags.filter(Boolean)
    else if (typeof data.tags === 'string') tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
  }
  const event = await prisma.event.create({
    data: {
      groupId,
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
  
  // Fetch event details for notification
  const event = await prisma.event.findUnique({ 
    where: { id }, 
    select: { 
      title: true, 
      groupId: true,
      group: { select: { ownerId: true } }
    } 
  })
  
  // If user RSVPs "going", ensure they are a member of the event's group
  if (String(status) === 'going' && event?.groupId) {
    // Attempt to upsert membership; if already exists, keep role as-is
    try {
      await prisma.groupMember.upsert({
        where: { userId_groupId: { userId, groupId: event.groupId } },
        create: { userId, groupId: event.groupId, role: 'member' },
        update: {},
      })
    } catch (e) {
      // ignore errors quietly
    }
  }
  
  // Create notification for user when they RSVP
  if (String(status) === 'going' || String(status) === 'interested') {
    const message = String(status) === 'going' 
      ? `You are attending "${event?.title}"` 
      : `You marked "${event?.title}" as interested`
    
    await prisma.notification.create({
      data: {
        userId,
        type: 'event_rsvp',
        message,
        data: {
          eventId: id,
          eventTitle: event?.title,
          status: String(status)
        }
      }
    })
  }
  
  res.json({ rsvp: upsert })
})

router.delete('/:id/rsvp', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const userId = req.user.id
  await prisma.eventAttendee.delete({ where: { userId_eventId: { userId, eventId: id } } }).catch(() => null)
  res.json({ ok: true })
})

export default router
