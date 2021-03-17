import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { InvalidUserIdError } from '@errors/User'
import { Password } from '@models/Password'
import { IEncryptionProvider } from '@providers/IEncryptionProvider'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { Either, left, right } from '@shared/Either'

type IResponse = Either<InvalidUserIdError | Error, Password>

export class CreatePasswordService {
  constructor(
    private passwordsRepository: IPasswordsRepository,
    private usersRepository: IUsersRepository,
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