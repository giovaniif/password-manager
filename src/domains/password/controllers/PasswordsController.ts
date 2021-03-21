import { container } from 'tsyringe'

import { CreatePasswordService } from '@domains/password/services/CreatePasswordService'
import { GetUserPasswordsService } from '@domains/user/services/GetUserPasswordsService'
import { GetSinglePasswordService } from '@domains/password/services/GetSinglePasswordService'

import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/infra/http/helpers/http'

export class PasswordsController {
  public async create(httpRequest: HttpRequest): Promise<HttpResponse> {
    const user_id = httpRequest.user.id
    const { title, value } = httpRequest.body

    const createPassword = container.resolve(CreatePasswordService)

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

  public async index(httpRequest: HttpRequest): Promise<HttpResponse> {
    const user_id = httpRequest.user.id

    const getPasswords = container.resolve(GetUserPasswordsService)

    try {
      const passwordsOrError = await getPasswords.execute({ userId: user_id })

      if (passwordsOrError.isLeft())
        return badRequest(passwordsOrError.value)

      return ok(passwordsOrError.value)
    } catch (err) {
      return serverError(err.message)
    }
  }

  public async show(httpRequest: HttpRequest): Promise<HttpResponse> {
    const user_id = httpRequest.user.id
    const { passwordId } = httpRequest.params

    const getSinglePassword = container.resolve(GetSinglePasswordService)

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
