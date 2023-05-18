import Aes from 'react-native-aes-crypto'

export function generateKey(password: string, salt: string, cost: number, length: number) {
    return Aes.pbkdf2(password, salt, cost, length)
}

export async function encryptData(text: string, key: string) {
    return Aes.randomKey(16).then(async iv => {
        const cipher = await Aes.encrypt(text, key, iv, 'aes-256-cbc');
		return ({ cipher, iv });
    })
}

export function decryptData(encryptedData: { cipher: string; iv: string }, key: string) {
    return Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc')
}
