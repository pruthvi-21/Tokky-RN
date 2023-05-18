import { NativeModules } from 'react-native'

interface KeychainManager {
    keyExists(identifier: string): Promise<boolean>
    storeKey(identifier: string, key: string, updateIfExists: boolean): Promise<void>
    fetchKey(identifier: string): Promise<string>
    deleteKey(identifier: string): Promise<void>
}

export const KeychainManager: KeychainManager = NativeModules.KeychainManager
