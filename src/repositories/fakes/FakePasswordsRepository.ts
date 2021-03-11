import { v4 } from 'uuid'

import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { Password } from '@models/Password'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IGetUserPasswordsDTO } from '@dtos/IGetUserPasswordsDTO'

export class FakePasswordsRepository implements IPasswordsRepository {
  private passwords: Password[] = []

  public async create({ userId, value, title }: ICreatePasswordDTO): Promise<Password> {
    const password = new Password()

    Object.assign(password, { id: v4() }, { user_id: userId, value, title })

    this.passwords.push(password)

    return password
  }

  public async getAllFromUser({ userId }: IGetUserPasswordsDTO): Promise<Password[]> {
    return this.passwords.filter(password => password.user_id === userId)
  }

  public async getSingle(passwordId: string): Promise<Password | undefined> {
    return this.passwords.find(password => password.id === passwordId)
  }
}