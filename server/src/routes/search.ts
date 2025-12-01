import { Router } from 'express'
import prisma from '../prisma'

const router = Router()

// GET /api/search?query=abc
// Unified search across events, groups, users
router.get('/', async (req, res) => {
  const { query, page = '1', limit = '5' } = req.query as any
  const qRaw = String(query || '').trim()
  if (!qRaw) {
    return res.json({ events: [], groups: [], users: [], suggestions: [] })
  }
  const tokens = qRaw.split(/\s+/).filter(Boolean)

  // Build OR arrays
  const buildStringOR = (fields: string[]) => {
    const ors: any[] = []
    tokens.forEach(t => {
      fields.forEach(f => {
        // Relation fields handled separately, this is for direct scalar fields
        ors.push({ [f]: { contains: t } })
      })
    })
    // Full phrase match
    fields.forEach(f => ors.push({ [f]: { contains: qRaw } }))
    return ors
  }

  // Events search (include group relations)
  const eventOR: any[] = []
  tokens.forEach(tok => {
    eventOR.push(
      { title: { contains: tok } },
      { description: { contains: tok } },
      { city: { contains: tok } },
      { venue: { contains: tok } },
      { address: { contains: tok } },
      { group: { name: { contains: tok } } },
      { group: { city: { contains: tok } } }
    )
  })
  eventOR.push(
    { title: { contains: qRaw } },
    { description: { contains: qRaw } },
    { city: { contains: qRaw } },
    { venue: { contains: qRaw } },
    { address: { contains: qRaw } },
    { group: { name: { contains: qRaw } } },
    { group: { city: { contains: qRaw } } }
  )

  const take = Math.min(100, Number(limit) || 5)
  const skip = (Number(page) - 1) * take
  // Get total counts for pagination
  const [eventsTotal, groupsTotal, usersTotal] = await Promise.all([
    prisma.event.count({ where: { OR: eventOR } }),
    prisma.group.count({ where: { OR: buildStringOR(['name', 'description', 'city']) } }),
    prisma.user.count({ where: { OR: buildStringOR(['name', 'email', 'bio', 'city']) } })
  ])
  const [events, groups, users] = await Promise.all([
    prisma.event.findMany({
      where: { OR: eventOR },
      skip,
      take,
      include: { group: true },
      orderBy: { startsAt: 'asc' }
    }),
    prisma.group.findMany({
      where: { OR: buildStringOR(['name', 'description', 'city']) },
      skip,
      take,
      include: { owner: true }
    }),
    prisma.user.findMany({
      where: { OR: buildStringOR(['name', 'email', 'bio', 'city']) },
      skip,
      take,
      select: { id: true, name: true, avatarUrl: true, bio: true, city: true }
    })
  ])

  let suggestions: any[] = []
  if (events.length === 0 && groups.length === 0 && users.length === 0) {
    // Fallback: upcoming events as suggestions
    suggestions = await prisma.event.findMany({
      take: 5,
      include: { group: true },
      orderBy: { startsAt: 'asc' }
    })
  }

  res.json({
    events,
    groups,
    users,
    suggestions,
    pagination: {
      events: {
        total: eventsTotal,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(eventsTotal / take)
      },
      groups: {
        total: groupsTotal,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(groupsTotal / take)
      },
      users: {
        total: usersTotal,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(usersTotal / take)
      }
    }
  })
})

export default router
