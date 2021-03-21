import crypto from 'crypto'

import { IEncryptionProvider } from '@shared/container/providers/models/IEncryptionProvider'

export class TDEAEncryptionProvider implements IEncryptionProvider {
  public encrypt(toBeEncrypted: string): string {
    const md5Key = crypto.createHash('md5').update(process.env.ENCRYPTION_KEY).digest("hex").substr(0, 24)
    const cipher = crypto.createCipheriv('des-ede3', md5Key, '')

    let encrypted = cipher.update(toBeEncrypted, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
  }

  public decrypt(toBeDecrypted: string): string {
    const md5Key = crypto.createHash('md5').update(process.env.ENCRYPTION_KEY).digest("hex").substr(0, 24)
    const decipher = crypto.createDecipheriv('des-ede3', md5Key, '');

    let decrypted = decipher.update(toBeDecrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
