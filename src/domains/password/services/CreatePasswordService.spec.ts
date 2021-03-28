import { FakeEncryptionProvider } from '@shared/container/providers/fakes/FakeEncryptionProvider'
import { IEncryptionProvider } from '@shared/container/providers/models/IEncryptionProvider'
import { FakePasswordsRepository } from '@domains/password/repositories/fakes/FakePasswordsRepository'
import { FakeUsersRepository } from '@domains/user/repositories/fakes/FakeUsersRepository'
import { IPasswordsRepository } from '@domains/password/repositories/IPasswordsRepository'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'

import { CreatePasswordService } from './CreatePasswordService'
import { User } from '@domains/user/models/User'

let createPasswordService: CreatePasswordService
let fakeUsersRepository: IUsersRepository
let fakePasswordsRepository: IPasswordsRepository
let fakeEncryptionProvider: IEncryptionProvider

describe('Create Password', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakePasswordsRepository = new FakePasswordsRepository()
    fakeEncryptionProvider = new FakeEncryptionProvider()

    createPasswordService = new CreatePasswordService(
      fakePasswordsRepository,
      fakeUsersRepository,
      fakeEncryptionProvider,
    )
  })

  it('should not create password with invalid user_id', async () => {
    const passwordOrError = await createPasswordService.execute({
      userId: 'invalid-user-id',
      title: 'Test',
      value: '1234',
    })

    expect(passwordOrError.isLeft()).toBeTruthy()
    expect(passwordOrError.value).toBeInstanceOf(Error)
  })

  it('should not create a password for a not-valid user', async () => {
    const validUserOrError = await fakeUsersRepository.create({
      email: 'valid-email@email.com',
      password: '123123',
    })

    const validUser = validUserOrError.isRight()
      ? validUserOrError.value
      : ({} as User)

    const passwordOrError = await createPasswordService.execute({
      userId: validUser.id,
      title: 'Test',
      value: '1234',
    })

    expect(passwordOrError.isLeft()).toBeTruthy()
    expect(passwordOrError.value).toBeInstanceOf(Error)
  })

  it('should create a password if valid info is provided', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '1234',
    })

    let user
    if (userOrError.isRight()) {
      user = userOrError.value
    }
    user.isValid = true

    const passwordOrError = await createPasswordService.execute({
      userId: user.id,
      title: 'test',
      value: '1234',
    })

    expect(passwordOrError.isRight()).toBeTruthy()
  })

  it('should create an encrypted password if valid info is provided', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '1234',
    })

    let user
    if (userOrError.isRight()) {
      user = userOrError.value
    }

    user.isValid = true

    const encrypt = jest.spyOn(fakeEncryptionProvider, 'encrypt')
    const value = 'password123'

    const passwordOrError = await createPasswordService.execute({
      userId: user.id,
      title: 'test',
      value,
    })

    const password = passwordOrError.isRight()
      ? passwordOrError.value
      : undefined
    const decrytedPassword = fakeEncryptionProvider.decrypt(password.value)

    expect(decrytedPassword).toEqual(value)
    expect(encrypt).toHaveBeenCalledTimes(1)
  })
})
