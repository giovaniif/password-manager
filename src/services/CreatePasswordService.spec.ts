import { FakeEncryptionProvider } from '@shared/container/providers/fakes/FakeEncryptionProvider'
import { FakeHashProvider } from '@shared/container/providers/fakes/FakeHashProvider'
import { IEncryptionProvider } from '@shared/container/providers/models/IEncryptionProvider'
import { IHashProvider } from '@shared/container/providers/models/IHashProvider'
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
    const passwordOrError = await createPasswordService.execute({
      userId: 'invalid-user-id',
      title: 'Test',
      value: '1234'
    })

    expect(passwordOrError.isLeft()).toBeTruthy()
    expect(passwordOrError.value).toBeInstanceOf(Error)
  })

  it('should create a password if valid info is provided', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '1234'
    })

    let user
    if (userOrError.isRight()) {
      user = userOrError.value
    }

    const passwordOrError = await createPasswordService.execute({
      userId: user.id,
      title: 'test',
      value: '1234'
    })

    expect(passwordOrError.isRight()).toBeTruthy()
  })

  it('should create an encrypted password if valid info is provided', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '1234'
    })

    let user
    if (userOrError.isRight()) {
      user = userOrError.value
    }

    const encrypt = jest.spyOn(fakeEncryptionProvider, 'encrypt')
    const value = 'password123'

    const passwordOrError = await createPasswordService.execute({
      userId: user.id,
      title: 'test',
      value
    })


    const password = passwordOrError.isRight() ? passwordOrError.value : undefined
    const decrytedPassword = fakeEncryptionProvider.decrypt(password.value)

    expect(decrytedPassword).toEqual(value)
    expect(encrypt).toHaveBeenCalledTimes(1)
  })
})