import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export interface AuthRequest extends Request {
  user?: any
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' })
  }
  const token = auth.split(' ')[1]
  try {
    const payload: any = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(401).json({ error: 'Invalid token user' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
