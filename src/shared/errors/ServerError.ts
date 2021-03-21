export class ServerError extends Error {
  constructor(reason: string) {
    super(`Internal server error. Reason: ${reason}`)
  }
}
