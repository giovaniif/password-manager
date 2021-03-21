import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import { authConfig } from '@config/auth'
import { IAuthenticateUserDTO } from '@dtos/IAuthenticateUserDTO'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { User } from '@models/User'
import { IHashProvider } from '@shared/container/providers/models/IHashProvider'
import { Either, left, right } from '@shared/Either'
import { InvalidEmailError, WrongPasswordError } from '@errors/User'

interface IUserResponse {
  user: User
  token: string
}

type IResponse = Either<InvalidEmailError | WrongPasswordError, IUserResponse>

@injectable()
export class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }

  public async execute({ email, password }: IAuthenticateUserDTO): Promise<IResponse> {
    const userOrError = await this.usersRepository.findByEmail(email)
    if (userOrError.isLeft()) return left(userOrError.value)

    const user = userOrError.value

    const passwordMatched = await this.hashProvider.compare(password, user.password)
    if (!passwordMatched)
      return left(new WrongPasswordError())

    const { expiresIn, secret } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return right({ user, token })
  }
}