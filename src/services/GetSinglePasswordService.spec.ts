import { AppError } from '@errors/AppError'
import { FakeEncryptionProvider } from '@providers/fakes/FakeEncryptionProvider'
import { IEncryptionProvider } from '@providers/IEncryptionProvider'
import { FakePasswordsRepository } from '@repositories/fakes/FakePasswordsRepository'
import { FakeUsersRepository } from '@repositories/fakes/FakeUsersRepository'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'
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
    const { id: userId } = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    const { id: passwordId } = await fakePasswordsRepository.create({
      userId,
      title: 'My Password',
      value: '12345'
    })

    const password = await getSinglePasswordService.execute({ passwordId, userId })
    expect(password.value).toBe('12345')
  })

  it('should throw an error when trying to get a password from a non existing user', async () => {
    await expect(getSinglePasswordService.execute({
      passwordId: '123-456-abc',
      userId: 'non-existing-user-id',
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should throw an error when trying to get a non existing password', async () => {
    const { id: userId } = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    await expect(getSinglePasswordService.execute({
      passwordId: 'invalid-password-id',
      userId
    })).rejects.toBeInstanceOf(AppError)
  })
})
