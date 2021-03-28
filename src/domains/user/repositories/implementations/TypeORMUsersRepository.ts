import { getRepository, Repository } from 'typeorm'

import { User } from '@domains/user/models/User'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { Either, left, right } from '@shared/Either'
import { ICreateUserDTO } from '@domains/user/dtos/ICreateUserDTO'
import { InvalidEmailError, InvalidUserIdError } from '@shared/errors/User'

export class TypeORMUsersRepository implements IUsersRepository {
  private usersRepository: Repository<User>

  constructor() {
    this.usersRepository = getRepository(User)
  }

  public async create(userData: ICreateUserDTO): Promise<Either<Error, User>> {
    try {
      const user = this.usersRepository.create({ ...userData, isValid: false })
      await this.usersRepository.save(user)

      return right(user)
    } catch (err) {
      return left(new Error('Error while creating user'))
    }
  }

  public async findByEmail(
    email: string,
  ): Promise<Either<InvalidEmailError, User>> {
    const user = await this.usersRepository.findOne({ where: { email } })

    if (!user) return left(new InvalidEmailError())

    return right(user)
  }

  public async findById(id: string): Promise<Either<InvalidUserIdError, User>> {
    const user = await this.usersRepository.findOne({ where: { id } })

    if (!user) return left(new InvalidUserIdError())

    return right(user)
  }
}
