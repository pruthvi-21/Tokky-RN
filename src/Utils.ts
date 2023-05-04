import base32Decode from 'base32-decode'
import base32Encode from 'base32-encode'
import { Platform } from 'react-native'

export const isAndroid = () => Platform.OS == 'android'
export const isIOS = () => Platform.OS == 'ios'

export const DEFAULT_PERIOD = 30
export const DEFAULT_DIGITS = 6
export const DEFAULT_ALGORITHM = 'SHA1'

const BASE32_REGEX = /^[A-Z2-7]+$/

export const generateUUID = () => {
    let dt = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
}

export function encodeSecretKey(key: string) {
    key = key.replace(/\s+/g, '').toUpperCase()

    if (BASE32_REGEX.test(key)) {
        return base32Encode(base32Decode(key, 'RFC4648'), 'RFC4648')
    } else {
        return null
    }
}
