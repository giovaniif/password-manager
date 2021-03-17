import { NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { AppError } from '@errors/AppError'
import { authConfig } from '@config/auth'
import { HttpRequest, HttpResponse } from '@shared/helpers/http'

interface ITokenPayload {
  iat: number
  exp: number
  sub: string
}

export const ensureAuthenticated = (request: HttpRequest, response: HttpResponse, next: NextFunction) => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, authConfig.jwt.secret)

    const { sub } = decoded as ITokenPayload

    request.user = {
      id: sub
    }

    return next()
  } catch {
    throw new AppError('Invalid JWT token', 401)
  }
}
