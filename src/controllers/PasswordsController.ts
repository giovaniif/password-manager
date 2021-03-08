import { Response, Request } from 'express'

import { PasswordsRepository } from '@repositories/implementations/PasswordsRepository'
import { CreatePasswordService } from '@services/CreatePasswordService'

export class PasswordsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { userId, password } = request.body

    const passwordsRepository = new PasswordsRepository()
    const createPassword = new CreatePasswordService(passwordsRepository)

    const createdPassword = await createPassword.execute({
      password,
      userId
    })

    return response.json(createdPassword)
  }
}