import AES from 'react-native-aes-crypto'
import argon2 from 'react-native-argon2'
import { ENC_ALGORITHM } from './Constants'

export class CryptoUtils {
    static generateKey(password: string, salt: string, cost: number, length: number) {
        return AES.pbkdf2(password, salt, cost, length)
    }

    static async encryptData(text: string, key: string, iv: string) {
        return await AES.encrypt(text, key, iv, ENC_ALGORITHM)
    }

    static async decryptData(cipher: string, key: string, iv: string) {
        return AES.decrypt(cipher, key, iv, ENC_ALGORITHM)
    }

    public static async hashPasscode(passcode: string): Promise<string | null> {
        try {
            const salt = await AES.sha1(passcode)
            const result = await argon2(passcode, salt, {})
            return result.rawHash
        } catch (err) {
            return null
        }
    }
}
