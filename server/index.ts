import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.type('text').send('Backend up on 5000. Open port 5173 for the frontend.')
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'api', ts: Date.now() })
})

const PORT = Number(process.env.PORT) || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`)
})
