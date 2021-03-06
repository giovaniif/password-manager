import { Request, Response } from 'express'

import { CreateUserService } from '@services/CreateUserService'
import { UsersRepository } from '@repositories/implementations/UsersRepository'

export class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository()
    const createUser = new CreateUserService(usersRepository)

    const { email, password } = request.body

    const user = await createUser.execute({ email, password })
    delete user.password

    return response.json(user)
  }
}
