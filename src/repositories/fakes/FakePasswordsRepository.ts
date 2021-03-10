import { v4 } from 'uuid'

import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { Password } from '@models/Password'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IGetUserPasswordsDTO } from '@dtos/IGetUserPasswordsDTO'

export class FakePasswordsRepository implements IPasswordsRepository {
  private passwords: Password[] = []

  public async create(passwordData: ICreatePasswordDTO): Promise<Password> {
    const password = new Password()

    Object.assign(password, { id: v4() }, passwordData)

    this.passwords.push(password)

    return password
  }

  public async getAllFromUser({ userId }: IGetUserPasswordsDTO): Promise<Password[]> {
    return this.passwords.filter(password => password.user_id !== userId)
  }
}