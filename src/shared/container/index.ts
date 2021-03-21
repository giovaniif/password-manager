import { container } from 'tsyringe'

import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { TypeORMUsersRepository } from '@domains/user/repositories/implementations/TypeORMUsersRepository'
import { PasswordsRepository } from '@domains/password/repositories/implementations/PasswordsRepository'
import { IPasswordsRepository } from '@domains/password/repositories/IPasswordsRepository'

import './providers'

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  TypeORMUsersRepository
)

container.registerSingleton<IPasswordsRepository>(
  'PasswordsRepository',
  PasswordsRepository
)
