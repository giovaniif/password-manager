import { User } from '../models/User'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { SetUserVerifiedService } from './SetUserVerifiedService'

const makeSut = () => {
  const fakeUsersRepository = new FakeUsersRepository()
  const sut = new SetUserVerifiedService(fakeUsersRepository)

  return { sut, fakeUsersRepository }
}

const makeThrowableSut = () => {
  const fakeUsersRepository = new FakeUsersRepository()
  const throwableSetVerified = async (id: string): Promise<User> => {
    throw new Error('generic error')
  }

  fakeUsersRepository.setVerified = throwableSetVerified
  const sut = new SetUserVerifiedService(fakeUsersRepository)

  return { sut, fakeUsersRepository }
}

describe('set user verified service', () => {
  test('should return an error if no user id is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute('')

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(Error)
  })

  test('should return an error if an invalid user id is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute('some-invalid-id')

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(Error)
  })

  test('should return the error if the usecase throws', async () => {
    const { sut, fakeUsersRepository } = makeThrowableSut()

    const { value } = await fakeUsersRepository.create({
      email: 'some-email@provider.com',
      password: '123123',
    })

    const user = value instanceof User ? value : ({} as User)

    const result = await sut.execute(user.id)
    const error = result.isLeft() ? result.value : ''

    expect(error).toBeInstanceOf(Error)
  })

  test('should return the verified user', async () => {
    const { sut, fakeUsersRepository } = makeSut()

    const result = await fakeUsersRepository.create({
      email: 'some-email@provider.com',
      password: '123123',
    })

    const user: User = result.isRight() ? result.value : ({} as User)

    const verifyResult = await sut.execute(user.id)
    const verifiedUser = verifyResult.isRight()
      ? verifyResult.value
      : ({} as User)

    expect(verifyResult.isRight()).toBeTruthy()
    expect(verifiedUser.isValid).toBeTruthy()
  })
})
