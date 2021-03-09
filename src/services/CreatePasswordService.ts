import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { AppError } from '@errors/AppError'
import { Password } from '@models/Password'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class CreatePasswordService {
  constructor(
    private passwordsRepository: IPasswordsRepository,
    private usersRepository: IUsersRepository
  ) { }

  public async execute(passwordData: ICreatePasswordDTO): Promise<Password> {
    const findUserById = await this.usersRepository.findById(passwordData.userId)

    if (!findUserById)
      throw new AppError('Invalid user id')

    const password = await this.passwordsRepository.create({
      password: passwordData.password,
      userId: passwordData.userId
    })

    return password
  }
}