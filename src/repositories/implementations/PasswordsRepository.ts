import { getRepository, Repository } from 'typeorm'

import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { Password } from '@models/Password'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'

export class PasswordsRepository implements IPasswordsRepository {
  private passwordsRepository: Repository<Password>

  constructor() {
    this.passwordsRepository = getRepository(Password)
  }

  public async create(passwordData: ICreatePasswordDTO): Promise<Password> {
    const password = this.passwordsRepository.create({
      user_id: passwordData.userId,
      ...passwordData.password
    })

    await this.passwordsRepository.save(password)

    return password
  }
}