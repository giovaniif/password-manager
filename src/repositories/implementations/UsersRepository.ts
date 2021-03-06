import { getRepository, Repository } from 'typeorm'

import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { User } from '@models/User'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class UsersRepository implements IUsersRepository {
  private usersRepository: Repository<User>

  constructor() {
    this.usersRepository = getRepository(User)
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.usersRepository.create(userData)
    await this.usersRepository.save(user)

    return user
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.usersRepository.findOne({
      where: { email }
    })

    return foundUser
  }
}