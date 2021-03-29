import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { SendVerificationEmailService } from './SendVerificationEmailService'

const makeSut = () => {
  const fakeUsersRepository = new FakeUsersRepository()
  const sut = new SendVerificationEmailService(fakeUsersRepository)

  return { sut }
}

describe('Send verification email', () => {
  it('should return an error if no user id is provided', async () => {
    const { sut } = makeSut()

    const promise = await sut.execute('')

    expect(promise.isLeft()).toBeTruthy()
  })

  it('should return an error if an invalid user id is provided', async () => {
    const { sut } = makeSut()

    const promise = await sut.execute('invalid-user-id')

    expect(promise.isLeft()).toBeTruthy()
  })
})
