import { Platform } from 'react-native'

export const isAndroid = () => Platform.OS == 'android'
export const isIOS = () => Platform.OS == 'ios'

export const DEFAULT_PERIOD = 30
export const DEFAULT_DIGITS = 6
export const DEFAULT_ALGORITHM = 'SHA1'
