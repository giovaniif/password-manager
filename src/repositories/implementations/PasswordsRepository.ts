import { getRepository, Repository } from 'typeorm'

import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { Password } from '@models/Password'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IGetUserPasswordsDTO } from '@dtos/IGetUserPasswordsDTO'
import { Either, left, right } from '@shared/Either'
import { InvalidPasswordIdError } from '@errors/Password'

export class PasswordsRepository implements IPasswordsRepository {
  private passwordsRepository: Repository<Password>

  constructor() {
    this.passwordsRepository = getRepository(Password)
  }

  public async create(passwordData: ICreatePasswordDTO): Promise<Either<Error, Password>> {
    try {
      const password = this.passwordsRepository.create({
        ...passwordData,
        user_id: passwordData.userId,
      })

      await this.passwordsRepository.save(password)
      return right(password)
    } catch (err) {
      return left(err.message)
    }
  }

  public async getAllFromUser({ userId }: IGetUserPasswordsDTO): Promise<Password[]> {
    return this.passwordsRepository.find({ where: { user_id: userId } })
  }

  public async getSingle(passwordId: string): Promise<Either<InvalidPasswordIdError, Password>> {
    const password = await this.passwordsRepository.findOne({
      where: { id: passwordId }
    })

    if (!password)
      return left(new InvalidPasswordIdError())

    return right(password)
  }
}