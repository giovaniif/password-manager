import { getRepository, Repository } from 'typeorm'

import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { User } from '@models/User'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { Either, left, right } from '@shared/Either'
import { InvalidEmailError, InvalidUserIdError } from '@errors/User'

export class UsersRepository implements IUsersRepository {
  private usersRepository: Repository<User>

  constructor() {
    this.usersRepository = getRepository(User)
  }

  public async create(userData: ICreateUserDTO): Promise<Either<Error, User>> {
    try {
      const user = this.usersRepository.create(userData)
      await this.usersRepository.save(user)

      return right(user)
    } catch (err) {
      return left(new Error('Error while creating user'))
    }
  }

  public async findByEmail(email: string): Promise<Either<InvalidEmailError, User>> {
    const user = await this.usersRepository.findOne({ where: { email } })

    if (!user)
      return left(new InvalidEmailError)

    return right(user)
  }

  public async findById(id: string): Promise<Either<InvalidUserIdError, User>> {
    const user = await this.usersRepository.findOne({ where: { id } })

    if (!user)
      return left(new InvalidUserIdError())

    return right(user)
  }
}