import { inject, injectable } from 'tsyringe'

import { User } from '@models/User'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { IHashProvider } from '@shared/container/providers/models/IHashProvider'
import { Either, left, right } from '@shared/Either'
import { PasswordTooShortError, RepeatedEmailError } from '@errors/User'

type IResponse = Either<RepeatedEmailError | PasswordTooShortError, User>

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }

  public async execute({ email, password }: ICreateUserDTO): Promise<IResponse> {
    const repeatedUser = await this.usersRepository.findByEmail(email)

    if (repeatedUser.isRight())
      return left(new RepeatedEmailError())

    if (password.length < 4)
      return left(new PasswordTooShortError())

    const hashedPassword = await this.hashProvider.generateHash(password)

    const userOrError = await this.usersRepository.create({
      email,
      password: hashedPassword
    })

    if (userOrError.isLeft())
      return left(userOrError.value)

    return right(userOrError.value)
  }
}
