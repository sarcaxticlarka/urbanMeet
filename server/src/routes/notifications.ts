import { Router } from 'express'
import prisma from '../prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/notifications - Get user's notifications
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { limit = '20', unreadOnly } = req.query as any
  
  const where: any = { userId: req.user.id }
  if (unreadOnly === 'true') {
    where.read = false
  }
  
  const notifications = await prisma.notification.findMany({
    where,
    take: Math.min(100, Number(limit)),
    orderBy: { createdAt: 'desc' }
  })
  
  res.json({ notifications })
})

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', requireAuth, async (req: AuthRequest, res) => {
  const count = await prisma.notification.count({
    where: { userId: req.user.id, read: false }
  })
  
  res.json({ count })
})

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  
  const notification = await prisma.notification.updateMany({
    where: { id, userId: req.user.id },
    data: { read: true }
  })
  
  res.json({ ok: true })
})

// PATCH /api/notifications/mark-all-read - Mark all as read
router.patch('/mark-all-read', requireAuth, async (req: AuthRequest, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user.id, read: false },
    data: { read: true }
  })
  
  res.json({ ok: true })
})

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  
  await prisma.notification.deleteMany({
    where: { id, userId: req.user.id }
  })
  
  res.json({ ok: true })
})

export default router
