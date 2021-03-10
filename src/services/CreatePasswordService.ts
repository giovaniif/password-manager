import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { AppError } from '@errors/AppError'
import { Password } from '@models/Password'
import { IEncryptionProvider } from '@providers/IEncryptionProvider'
import { IHashProvider } from '@providers/IHashProvider'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class CreatePasswordService {
  constructor(
    private passwordsRepository: IPasswordsRepository,
    private usersRepository: IUsersRepository,
    private encryptionProvider: IEncryptionProvider,
  ) { }

  public async execute({ password, userId }: ICreatePasswordDTO): Promise<Password> {
    const findUserById = await this.usersRepository.findById(userId)

    if (!findUserById)
      throw new AppError('Invalid user id')

    const encryptedPassword = this.encryptionProvider.encrypt(password.value)

    const createdPassword = await this.passwordsRepository.create({
      userId,
      password: {
        title: password.title,
        value: encryptedPassword
      }
    })

    return createdPassword
  }
}