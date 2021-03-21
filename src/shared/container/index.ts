import { container } from 'tsyringe'

import { IUsersRepository } from '@repositories/IUsersRepository'
import { UsersRepository } from '@repositories/implementations/UsersRepository'
import { PasswordsRepository } from '@repositories/implementations/PasswordsRepository'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'

import './providers'

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)

container.registerSingleton<IPasswordsRepository>(
  'PasswordsRepository',
  PasswordsRepository
)
