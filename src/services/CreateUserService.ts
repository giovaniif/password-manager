import { AppError } from '@errors/AppError'
import { User } from '@models/User'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { ICreateUserDTO } from '@dtos/ICreateUserDTO'

export class CreateUserService {
  constructor(private usersRepository: IUsersRepository) { }

  public async execute({ email, password }: ICreateUserDTO): Promise<User> {
    const findRepeatedUser = await this.usersRepository.findByEmail(email)

    if (findRepeatedUser) {
      throw new AppError('This email is already in use')
    }

    const user = await this.usersRepository.create({ email, password })

    return user
  }
}
