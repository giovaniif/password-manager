import { AppError } from '@errors/AppError'
import { Password } from '@models/Password'
import { FakeEncryptionProvider } from '@providers/fakes/FakeEncryptionProvider'
import { FakeHashProvider } from '@providers/fakes/FakeHashProvider'
import { IEncryptionProvider } from '@providers/IEncryptionProvider'
import { IHashProvider } from '@providers/IHashProvider'
import { FakePasswordsRepository } from '@repositories/fakes/FakePasswordsRepository'
import { FakeUsersRepository } from '@repositories/fakes/FakeUsersRepository'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { CreatePasswordService } from './CreatePasswordService'
import { CreateUserService } from './CreateUserService'

let createPasswordService: CreatePasswordService
let createUserService: CreateUserService
let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider
let fakePasswordsRepository: IPasswordsRepository
let fakeEncryptionProvider: IEncryptionProvider

describe('Create Password', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakePasswordsRepository = new FakePasswordsRepository()
    fakeEncryptionProvider = new FakeEncryptionProvider()

    createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider)
    createPasswordService = new CreatePasswordService(fakePasswordsRepository, fakeUsersRepository, fakeEncryptionProvider)
  })

  it('should not create password with invalid user_id', async () => {
    await expect(createPasswordService.execute({
      userId: 'invalid-user-id',
      password: {
        title: 'Test',
        value: '1234'
      }
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should create a password if valid info is provided', async () => {
    const user = await createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '1234'
    })

    const password = await createPasswordService.execute({
      userId: user.id,
      password: {
        title: 'test',
        value: '1234'
      },
    })

    expect(password).toBeInstanceOf(Password)
    expect(password).toHaveProperty('id')
  })

  it('should create an encrypted password if valid info is provided', async () => {
    const user = await createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '1234'
    })

    const value = '1234'

    const password = await createPasswordService.execute({
      userId: user.id,
      password: {
        title: 'test',
        value
      },
    })

    const decrytedPassword = fakeEncryptionProvider.decrypt(password.value)

    expect(password).toBeInstanceOf(Password)
    expect(decrytedPassword).toEqual(decrytedPassword)
  })
})