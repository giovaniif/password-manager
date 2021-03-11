import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { AppError } from '@errors/AppError'
import { Password } from '@models/Password'
import { IEncryptionProvider } from '@providers/IEncryptionProvider'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class CreatePasswordService {
  constructor(
    private passwordsRepository: IPasswordsRepository,
    private usersRepository: IUsersRepository,
    private encryptionProvider: IEncryptionProvider,
  ) { }

  public async execute({ value, title, userId }: ICreatePasswordDTO): Promise<Password> {
    const findUserById = await this.usersRepository.findById(userId)

    if (!findUserById)
      throw new AppError('Invalid user id')

    const encryptedPassword = this.encryptionProvider.encrypt(value)

    const createdPassword = await this.passwordsRepository.create({
      userId,
      title,
      value: encryptedPassword
    })

    return createdPassword
  }
}