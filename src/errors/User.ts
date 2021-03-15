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

