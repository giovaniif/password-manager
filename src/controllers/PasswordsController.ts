import { Response, Request } from 'express'

import { PasswordsRepository } from '@repositories/implementations/PasswordsRepository'
import { CreatePasswordService } from '@services/CreatePasswordService'
import { UsersRepository } from '@repositories/implementations/UsersRepository'
import { GetUserPasswordsService } from '@services/GetUserPasswordsService'
import { TDEAEncryptionProvider } from '@providers/implementations/TDEAEncryptionProvider'
import { GetSinglePasswordService } from '@services/GetSinglePasswordService'
import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/helpers/http'

export class PasswordsController {
  public async create(httpRequest: HttpRequest): Promise<HttpResponse> {
    const user_id = httpRequest.user.id
    const { title, value } = httpRequest.body

    const passwordsRepository = new PasswordsRepository()
    const usersRepository = new UsersRepository()
    const encryptionProvider = new TDEAEncryptionProvider()

    const createPassword = new CreatePasswordService(
      passwordsRepository,
      usersRepository,
      encryptionProvider
    )

    try {
      const passwordOrError = await createPassword.execute({
        userId: user_id,
        title,
        value
      })

      if (passwordOrError.isLeft())
        return badRequest(passwordOrError.value)

      const password = passwordOrError.value
      delete password.value

      return ok(password)
    } catch (err) {
      return serverError(err.message)
    }
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const passwordsRepository = new PasswordsRepository()
    const usersRepository = new UsersRepository()
    const getPasswords = new GetUserPasswordsService(passwordsRepository, usersRepository)

    const passwords = await getPasswords.execute({ userId: user_id })

    return response.json(passwords)
  }

  public async show(httpRequest: HttpRequest): Promise<HttpResponse> {
    const user_id = httpRequest.user.id
    const { passwordId } = httpRequest.params

    const usersRepository = new UsersRepository()
    const passwordsRepository = new PasswordsRepository()
    const encryptionProvider = new TDEAEncryptionProvider()
    const getSinglePassword = new GetSinglePasswordService(
      usersRepository,
      passwordsRepository,
      encryptionProvider
    )

    try {
      const passwordOrError = await getSinglePassword.execute({
        passwordId,
        userId: user_id
      })

      if (passwordOrError.isLeft())
        return badRequest(passwordOrError.value)

      return ok(passwordOrError.value)
    } catch (err) {
      return serverError(err.message)
    }
  }
}