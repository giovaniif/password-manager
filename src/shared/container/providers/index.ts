import { container } from 'tsyringe'

import { BCryptHashProvider } from './implementations/BCryptHashProvider'
import { TDEAEncryptionProvider } from './implementations/TDEAEncryptionProvider'
import { IEncryptionProvider } from './models/IEncryptionProvider'
import { IHashProvider } from './models/IHashProvider'

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider)

container.registerSingleton<IEncryptionProvider>(
  'EncryptionProvider',
  TDEAEncryptionProvider,
)
