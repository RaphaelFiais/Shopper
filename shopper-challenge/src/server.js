import express from 'express'
import { routes } from './routes'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())
routes(app)
const port = 3000

app.listen(3000, () => {
  console.log('Start server on port ', port)
})
