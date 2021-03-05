import 'dotenv/config'

import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(
  process.env.APP_PORT,
  () => console.log(`app running on port: ${process.env.APP_PORT}`)
)
