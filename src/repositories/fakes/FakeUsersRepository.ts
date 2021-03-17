import { v4 } from 'uuid'

import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { User } from '@models/User'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { Either, left, right } from '@shared/Either'
import { InvalidEmailError, InvalidUserIdError } from '@errors/User'

export class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User()

    Object.assign(user, { id: v4() }, userData)

    this.users.push(user)

    return user
  }

  public async findByEmail(email: string): Promise<Either<InvalidEmailError, User>> {
    const user = this.users.find(user => user.email === email)

    if (!user)
      return left(new InvalidEmailError())

    return right(user)
  }

  public async findById(id: string): Promise<Either<InvalidUserIdError, User>> {
    const user = this.users.find(user => user.id === id)

    if (!user)
      return left(new InvalidUserIdError())

    return right(user)
  }
}