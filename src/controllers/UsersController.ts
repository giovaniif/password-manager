import { CreateUserService } from '@services/CreateUserService'
import { UsersRepository } from '@repositories/implementations/UsersRepository'
import { BCryptHashProvider } from '@shared/container/providers/implementations/BCryptHashProvider'
import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/helpers/http'

export class UsersController {
  public async create(httpRequest: HttpRequest): Promise<HttpResponse> {
    const usersRepository = new UsersRepository()
    const hashProvider = new BCryptHashProvider()
    const createUser = new CreateUserService(usersRepository, hashProvider)

    const { email, password } = httpRequest.body

    try {
      const userOrError = await createUser.execute({ email, password })

      if (userOrError.isLeft())
        return badRequest(userOrError.value)

      const user = userOrError.value
      return ok(user)
    } catch (err) {
      return serverError(err.message)
    }
  }
}
