import { AuthenticateUserService } from '@services/AuthenticateUserService'
import { UsersRepository } from '@repositories/implementations/UsersRepository'
import { BCryptHashProvider } from '@shared/container/providers/implementations/BCryptHashProvider'
import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/helpers/http'

export class SessionsController {
  public async create(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    const usersRepository = new UsersRepository()
    const bCryptHashProvider = new BCryptHashProvider()
    const authUser = new AuthenticateUserService(usersRepository, bCryptHashProvider)

    try {
      const authenticateUserResponse = await authUser.execute({ email, password })

      if (authenticateUserResponse.isLeft()) {
        return badRequest(authenticateUserResponse.value)
      }

      const { token, user } = authenticateUserResponse.value
      delete user.password

      return ok({ token, user })
    } catch (err) {
      return serverError(err.message)
    }
  }
}