import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import prisma from '../prisma'
import { evaluatePasswordStrength, validateStrongPassword } from '../utils/password'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

// Email availability check
router.get('/check-email', async (req, res) => {
  const { email } = req.query as any
  if (!email) return res.status(400).json({ error: 'email required' })
  const existing = await prisma.user.findUnique({ where: { email: String(email) } })
  res.json({ available: !existing })
})

// Password strength endpoint
router.get('/password-strength', async (req, res) => {
  const { password } = req.query as any
  if (!password) return res.status(400).json({ error: 'password required' })
  const result = evaluatePasswordStrength(String(password))
  res.json(result)
})

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ error: 'User already exists' })
  const weakReason = validateStrongPassword(password)
  if (weakReason) return res.status(400).json({ error: weakReason })
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hash, name } })
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' })
  res.json({ token, user })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' })
  res.json({ token, user })
})

// Forgot password - generate token
router.post('/forgot', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'email required' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(200).json({ ok: true }) // do not reveal existence
  // Invalidate existing tokens for this user (optional cleanup)
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, used: false } })
  const rawToken = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
  await prisma.passwordResetToken.create({ data: { userId: user.id, token: rawToken, expiresAt: expires } })
  // In real app send email. Here we return token for dev convenience.
  res.json({ ok: true, resetToken: rawToken, expiresAt: expires })
})

// Reset password
router.post('/reset', async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ error: 'token and password required' })
  const record = await prisma.passwordResetToken.findUnique({ where: { token } })
  if (!record || record.used || record.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' })
  const weakReason = validateStrongPassword(password)
  if (weakReason) return res.status(400).json({ error: weakReason })
  const hash = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { id: record.userId }, data: { password: hash } })
  await prisma.passwordResetToken.update({ where: { token }, data: { used: true } })
  res.json({ ok: true })
})

router.get('/me', async (req: any, res) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(200).json({ user: null })
  const token = auth.split(' ')[1]
  try {
    const payload: any = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    return res.json({ user })
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
