export class InvalidEmailError extends Error {
  constructor() {
    super('Invalid email')
  }
}

export class WrongPasswordError extends Error {
  constructor() {
    super('Wrong password')
  }
}

export class InvalidUserIdError extends Error {
  constructor() {
    super('Invalid user id')
  }
}

export class RepeatedEmailError extends Error {
  constructor() {
    super('This email is already in use')
  }
}

export class PasswordTooShortError extends Error {
  constructor() {
    super('Password must be at least 4 digits')
  }
}

export class NonVerifiedUserError extends Error {
  constructor() {
    super('You must verify your email address to create passwords')
  }
}
