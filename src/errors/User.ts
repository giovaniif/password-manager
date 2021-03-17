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
