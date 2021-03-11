import { IGetSinglePasswordServiceDTO } from '@dtos/IGetSinglePasswordServiceDTO'
import { AppError } from '@errors/AppError'
import { Password } from '@models/Password'
import { IEncryptionProvider } from '@providers/IEncryptionProvider'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class GetSinglePasswordService {
  constructor(
    private usersRepository: IUsersRepository,
    private passwordsRepository: IPasswordsRepository,
    private encryptionProvider: IEncryptionProvider
  ) { }

  public async execute({ passwordId, userId }: IGetSinglePasswordServiceDTO): Promise<Password> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists)
      throw new AppError('User does not exist')

    const encryptedPassword = await this.passwordsRepository.getSingle(passwordId)

    if (!encryptedPassword)
      throw new AppError('Invalid passwordId')

    const decryptedPassword = encryptedPassword
    decryptedPassword.value = this.encryptionProvider.decrypt(encryptedPassword.value)

    return decryptedPassword
  }
}
