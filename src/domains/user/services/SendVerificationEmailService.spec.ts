import { SendVerificationEmailService } from './SendVerificationEmailService'

const makeSut = () => {
  const sut = new SendVerificationEmailService()

  return { sut }
}

describe('Send verification email', () => {
  it('should send the verification email', async () => {
    const { sut } = makeSut()

    const message = await sut.execute({ to: 'giovani@adopets.org' })

    expect(message).toHaveProperty('messageId')
  })
})
