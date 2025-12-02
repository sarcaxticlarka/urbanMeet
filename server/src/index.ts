import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from './config/passport'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import groupRoutes from './routes/groups'
import eventRoutes from './routes/events'
import commentRoutes from './routes/comments'
import notificationRoutes from './routes/notifications'
import searchRoutes from './routes/search'
import prisma from './prisma'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(passport.initialize())

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/notifications', notificationRoutes)
// Nest comments under events: /api/events/:eventId/comments
app.use('/api/events', commentRoutes)
// Unified cross-entity search endpoint
app.use('/api/search', searchRoutes)

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
