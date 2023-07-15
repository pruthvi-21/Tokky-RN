import { Platform } from 'react-native'

export const isAndroid = () => Platform.OS == 'android'
export const isIOS = () => Platform.OS == 'ios'

export const generateUUID = () => {
    let dt = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
}

export function getThumbnailInitials(str: String) {
    if (str == '') return '?'
    const words = str.split(' ')
    let initials = ''

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i].charAt(0)
    }

    return initials.toUpperCase()
}

export function getExportFileName() {
    return 'tokky-export-' + new Date().toISOString().split('T')[0] + '.txt'
}
