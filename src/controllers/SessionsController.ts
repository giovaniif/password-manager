import { Response, Request } from 'express'

import { AuthenticateUserService } from '@services/AuthenticateUserService'
import { UsersRepository } from '@repositories/implementations/UsersRepository'
import { BCryptHashProvider } from '@providers/implementations/BCryptHashProvider'

export class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body

    const usersRepository = new UsersRepository()
    const bCryptHashProvider = new BCryptHashProvider()
    const authUser = new AuthenticateUserService(usersRepository, bCryptHashProvider)

    const { token, user } = await authUser.execute({ email, password })

    delete user.password

    return response.json({ token, user })
  }
}