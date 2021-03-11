import { Response, Request } from 'express'

import { PasswordsRepository } from '@repositories/implementations/PasswordsRepository'
import { CreatePasswordService } from '@services/CreatePasswordService'
import { UsersRepository } from '@repositories/implementations/UsersRepository'
import { GetUserPasswordsService } from '@services/GetUserPasswordsService'
import { TDEAEncryptionProvider } from '@providers/implementations/TDEAEncryptionProvider'
import { GetSinglePasswordService } from '@services/GetSinglePasswordService'

export class PasswordsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id
    const { title, value } = request.body

    const passwordsRepository = new PasswordsRepository()
    const usersRepository = new UsersRepository()
    const encryptionProvider = new TDEAEncryptionProvider()

    const createPassword = new CreatePasswordService(
      passwordsRepository,
      usersRepository,
      encryptionProvider
    )

    const createdPassword = await createPassword.execute({
      userId: user_id,
      title,
      value
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

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id
    const { passwordId } = request.params

    const usersRepository = new UsersRepository()
    const passwordsRepository = new PasswordsRepository()
    const encryptionProvider = new TDEAEncryptionProvider()
    const getSinglePassword = new GetSinglePasswordService(
      usersRepository,
      passwordsRepository,
      encryptionProvider
    )

    const password = await getSinglePassword.execute({
      passwordId,
      userId: user_id
    })

    return response.json(password)
  }
}