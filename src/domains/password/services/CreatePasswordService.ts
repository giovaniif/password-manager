import { inject, injectable } from 'tsyringe'

import { ICreatePasswordDTO } from '@domains/password/dtos/ICreatePasswordDTO'
import { InvalidUserIdError } from '@shared/errors/User'
import { Password } from '@domains/password/models/Password'
import { IEncryptionProvider } from '@shared/container/providers/models/IEncryptionProvider'
import { IPasswordsRepository } from '@domains/password/repositories/IPasswordsRepository'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { Either, left, right } from '@shared/Either'

type IResponse = Either<InvalidUserIdError | Error, Password>

@injectable()
export class CreatePasswordService {
  constructor(
    @inject('PasswordsRepository')
    private passwordsRepository: IPasswordsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EncryptionProvider')
    private encryptionProvider: IEncryptionProvider,
  ) { }

  public async execute({ value, title, userId }: ICreatePasswordDTO): Promise<IResponse> {
    const userOrError = await this.usersRepository.findById(userId)

    if (userOrError.isLeft())
      return left(userOrError.value)

    const encryptedPassword = this.encryptionProvider.encrypt(value)

    const passwordOrError = await this.passwordsRepository.create({
      userId,
      title,
      value: encryptedPassword
    })

    if (passwordOrError.isLeft())
      return left(passwordOrError.value)

    const password = passwordOrError.value
    return right(password)
  }
}