import { IGetUserPasswordsDTO } from '@dtos/IGetUserPasswordsDTO'
import { AppError } from '@errors/AppError'
import { Password } from '@models/Password'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class GetUserPasswordsService {
  constructor(
    private passwordsRepository: IPasswordsRepository,
    private usersRepository: IUsersRepository
  ) { }

  public async execute({ userId }: IGetUserPasswordsDTO): Promise<Password[]> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists)
      throw new AppError('User not found')

    const passwords = await this.passwordsRepository.getAllFromUser({ userId })

    return passwords
  }
}
