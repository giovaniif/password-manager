import { v4 } from 'uuid'

import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { User } from '@models/User'
import { IUsersRepository } from '@repositories/IUsersRepository'

export class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User()

    Object.assign(user, { id: v4() }, userData)

    this.users.push(user)

    return user
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email)
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id)
  }
}