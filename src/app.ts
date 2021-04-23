import 'dotenv/config'
import 'reflect-metadata'

import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import path from 'path'

import '@shared/infra/typeorm'
import '@shared/container'

import { routes } from '@shared/infra/http/routes'
import rateLimiter from '@shared/infra/http/routes/middlewares/rateLimiter'

const app = express()

app.use(rateLimiter)
app.use(cors())
app.use(express.json())
app.use(routes)
app.use(express.static(path.resolve(__dirname, '..', 'public')))

// app.use(errors())

// app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
//   if (err instanceof AppError) {
//     return response.status(err.statusCode).json({
//       status: 'error',
//       message: err.message,
//     });
//   }

//   console.log(err);

//   return response.status(500).json({
//     status: 'error',
//     message: 'Internal server error',
//   });
// })

app.listen(process.env.APP_PORT || 3333, () =>
  console.log(`app running on port: ${process.env.APP_PORT}`),
)
