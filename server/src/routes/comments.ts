import { Router } from 'express'
import prisma from '../prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router({ mergeParams: true })

router.get('/:eventId/comments', async (req, res) => {
  const { eventId } = req.params
  const page = Number(req.query.page || 1)
  const limit = Math.min(100, Number(req.query.limit || 20))
  const comments = await prisma.comment.findMany({ where: { eventId }, skip: (page - 1) * limit, take: limit, include: { user: true } })
  res.json({ comments })
})

router.post('/:eventId/comments', requireAuth, async (req: AuthRequest, res) => {
  const { eventId } = req.params
  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'content required' })
  const comment = await prisma.comment.create({ data: { eventId, userId: req.user.id, content } })
  res.json({ comment })
})

export default router
