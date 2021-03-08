import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { Password } from '@models/Password'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'

export class CreatePasswordService {
  constructor(private passwordsRepository: IPasswordsRepository) { }

  public async execute(passwordData: ICreatePasswordDTO): Promise<Password> {
    const password = await this.passwordsRepository.create({
      password: passwordData.password,
      userId: passwordData.userId
    })

    return password
  }
}