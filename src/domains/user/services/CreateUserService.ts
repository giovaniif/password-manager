import { container, inject, injectable } from 'tsyringe'

import { User } from '@domains/user/models/User'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { ICreateUserDTO } from '@domains/user/dtos/ICreateUserDTO'
import { IHashProvider } from '@shared/container/providers/models/IHashProvider'
import { Either, left, right } from '@shared/Either'
import { PasswordTooShortError, RepeatedEmailError } from '@shared/errors/User'
import { SendVerificationEmailService } from './SendVerificationEmailService'

type IResponse = Either<RepeatedEmailError | PasswordTooShortError, User>

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: ICreateUserDTO): Promise<IResponse> {
    const repeatedUser = await this.usersRepository.findByEmail(email)

    if (repeatedUser.isRight()) return left(new RepeatedEmailError())

    if (password.length < 4) return left(new PasswordTooShortError())

    const hashedPassword = await this.hashProvider.generateHash(password)

    const userOrError = await this.usersRepository.create({
      email,
      password: hashedPassword,
    })

    if (userOrError.isLeft()) return left(userOrError.value)

    const mailService = container.resolve(SendVerificationEmailService)
    await mailService.execute(userOrError.value.id)

    return right(userOrError.value)
  }
}
