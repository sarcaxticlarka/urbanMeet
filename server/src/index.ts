import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import groupRoutes from './routes/groups'
import eventRoutes from './routes/events'
import commentRoutes from './routes/comments'
import prisma from './prisma'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/events', eventRoutes)
app.use('/api', commentRoutes) // comments endpoints under /api/:eventId/comments

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
