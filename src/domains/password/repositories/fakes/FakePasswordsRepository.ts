import { v4 } from 'uuid'

import { ICreatePasswordDTO } from '@domains/password/dtos/ICreatePasswordDTO'
import { Password } from '@domains/password/models/Password'
import { IPasswordsRepository } from '@domains/password/repositories/IPasswordsRepository'
import { IGetUserPasswordsDTO } from '@domains/user/dtos/IGetUserPasswordsDTO'
import { Either, left, right } from '@shared/Either'
import { InvalidPasswordIdError } from '@shared/errors/Password'

export class FakePasswordsRepository implements IPasswordsRepository {
  private passwords: Password[] = []

  public async create({
    userId,
    value,
    title,
  }: ICreatePasswordDTO): Promise<Either<Error, Password>> {
    try {
      const password = new Password()

      Object.assign(password, { id: v4() }, { user_id: userId, value, title })
      this.passwords.push(password)

      return right(password)
    } catch (err) {
      return left(err.message)
    }
  }

  public async getAllFromUser({
    userId,
  }: IGetUserPasswordsDTO): Promise<Password[]> {
    return this.passwords.filter(password => password.user_id === userId)
  }

  public async getSingle(
    passwordId: string,
  ): Promise<Either<InvalidPasswordIdError, Password>> {
    const password = this.passwords.find(password => password.id === passwordId)

    if (!password) return left(new InvalidPasswordIdError())

    return right(password)
  }
}
