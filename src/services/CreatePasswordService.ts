import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { AppError } from '@errors/AppError'
import { Password } from '@models/Password'
import { IHashProvider } from '@providers/IHashProvider'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class CreatePasswordService {
  constructor(
    private passwordsRepository: IPasswordsRepository,
    private usersRepository: IUsersRepository,
    private hashProvider: IHashProvider
  ) { }

  public async execute(passwordData: ICreatePasswordDTO): Promise<Password> {
    const findUserById = await this.usersRepository.findById(passwordData.userId)

    if (!findUserById)
      throw new AppError('Invalid user id')

    const hashedPassword = await this.hashProvider.generateHash(passwordData.password.value)

    const password = await this.passwordsRepository.create({
      userId: passwordData.userId,
      password: {
        title: passwordData.password.title,
        value: hashedPassword
      },
    })

    return password
  }
}