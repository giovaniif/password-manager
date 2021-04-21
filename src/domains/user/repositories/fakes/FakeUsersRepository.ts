import { v4 } from 'uuid'

import { ICreateUserDTO } from '@domains/user/dtos/ICreateUserDTO'
import { User } from '@domains/user/models/User'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { Either, left, right } from '@shared/Either'
import { InvalidEmailError, InvalidUserIdError } from '@shared/errors/User'

export class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async create(userData: ICreateUserDTO): Promise<Either<Error, User>> {
    const user = new User()

    Object.assign(user, { id: v4(), isValid: false }, userData)

    this.users.push(user)

    return right(user)
  }

  public async findByEmail(
    email: string,
  ): Promise<Either<InvalidEmailError, User>> {
    const user = this.users.find(user => user.email === email)

    if (!user) return left(new InvalidEmailError())

    return right(user)
  }

  public async findById(id: string): Promise<Either<InvalidUserIdError, User>> {
    const user = this.users.find(user => user.id === id)

    if (!user) return left(new InvalidUserIdError())

    return right(user)
  }

  public async setVerified(id: string): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id)
    this.users[userIndex] = {
      ...this.users[userIndex],
      isValid: true,
    }

    return this.users[userIndex]
  }
}
