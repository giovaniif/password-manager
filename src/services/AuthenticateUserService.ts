import { sign } from 'jsonwebtoken'

import { authConfig } from '@config/auth'
import { IAuthenticateUserDTO } from '@dtos/IAuthenticateUserDTO'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { User } from '@models/User'
import { AppError } from '@errors/AppError'
import { IHashProvider } from '@providers/IHashProvider'

interface IResponse {
  user: User
  token: string
}

export class AuthenticateUserService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashProvider: IHashProvider
  ) { }

  public async execute({ email, password }: IAuthenticateUserDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user)
      throw new AppError('Email not found')

    const passwordMatched = await this.hashProvider.compare(password, user.password)
    if (!passwordMatched)
      throw new AppError('Wrong password')

    const { expiresIn, secret } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return { user, token }
  }
}