import { AppError } from '@errors/AppError'
import { User } from '@models/User'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { IHashProvider } from '@providers/IHashProvider'

export class CreateUserService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashProvider: IHashProvider
  ) { }

  public async execute({ email, password }: ICreateUserDTO): Promise<User> {
    const findRepeatedUser = await this.usersRepository.findByEmail(email)

    if (findRepeatedUser)
      throw new AppError('This email is already in use')

    if (password.length < 4)
      throw new AppError('Password too short')

    const hashedPassword = await this.hashProvider.generateHash(password)

    const user = await this.usersRepository.create({
      email,
      password: hashedPassword
    })

    return user
  }
}
