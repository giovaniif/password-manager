import { Response, Request } from 'express'

import { PasswordsRepository } from '@repositories/implementations/PasswordsRepository'
import { CreatePasswordService } from '@services/CreatePasswordService'
import { UsersRepository } from '@repositories/implementations/UsersRepository'
import { GetUserPasswordsService } from '@services/GetUserPasswordsService'

export class PasswordsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id
    const { password } = request.body

    const passwordsRepository = new PasswordsRepository()
    const usersRepository = new UsersRepository()
    const createPassword = new CreatePasswordService(
      passwordsRepository,
      usersRepository,
    )

    const createdPassword = await createPassword.execute({
      password,
      userId: user_id
    })

    delete createdPassword.value

    return response.json(createdPassword)
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const passwordsRepository = new PasswordsRepository()
    const usersRepository = new UsersRepository()
    const getPasswords = new GetUserPasswordsService(passwordsRepository, usersRepository)

    const passwords = await getPasswords.execute({ userId: user_id })

    return response.json(passwords)
  }
}