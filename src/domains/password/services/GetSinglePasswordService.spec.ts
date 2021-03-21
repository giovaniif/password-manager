import { FakeEncryptionProvider } from '@shared/container/providers/fakes/FakeEncryptionProvider'
import { IEncryptionProvider } from '@shared/container/providers/models/IEncryptionProvider'
import { FakePasswordsRepository } from '@domains/password/repositories/fakes/FakePasswordsRepository'
import { FakeUsersRepository } from '@domains/user/repositories/fakes/FakeUsersRepository'
import { IPasswordsRepository } from '@domains/password/repositories/IPasswordsRepository'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { GetSinglePasswordService } from './GetSinglePasswordService'

let getSinglePasswordService: GetSinglePasswordService
let fakePasswordsRepository: IPasswordsRepository
let fakeUsersRepository: IUsersRepository
let fakeEncryptionProvider: IEncryptionProvider

describe('Get single password', () => {
  beforeEach(() => {
    fakePasswordsRepository = new FakePasswordsRepository()
    fakeUsersRepository = new FakeUsersRepository()
    fakeEncryptionProvider = new FakeEncryptionProvider()

    getSinglePasswordService = new GetSinglePasswordService(
      fakeUsersRepository,
      fakePasswordsRepository,
      fakeEncryptionProvider
    )
  })

  it('should return a single decrypted password', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    let userId
    if (userOrError.isRight())
      userId = userOrError.value.id

    const passwordOrError = await fakePasswordsRepository.create({
      userId,
      title: 'My Password',
      value: '12345'
    })

    let passwordId
    if (passwordOrError.isRight())
      passwordId = passwordOrError.value.id

    const singlePasswordOrError = await getSinglePasswordService.execute({ passwordId, userId })
    let singlePassword

    if (singlePasswordOrError.isRight())
      singlePassword = singlePasswordOrError.value

    expect(singlePassword.value).toBe('12345')
  })

  it('should throw an error when trying to get a password from a non existing user', async () => {
    const passwordOrError = await getSinglePasswordService.execute({
      passwordId: '123-456-abc',
      userId: 'non-existing-user-id',
    })

    expect(passwordOrError.isLeft()).toBeTruthy()
  })

  it('should throw an error when trying to get a non existing password', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    let userId
    if (userOrError.isRight())
      userId = userOrError.value.id

    const passwordOrError = await getSinglePasswordService.execute({
      passwordId: 'invalid-password-id',
      userId
    })

    expect(passwordOrError.isLeft()).toBeTruthy()
  })
})
