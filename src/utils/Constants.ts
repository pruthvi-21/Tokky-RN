import { ColorValue } from 'react-native'

export enum AlgorithmType {
    SHA1 = 'SHA-1',
    SHA256 = 'SHA-256',
    SHA512 = 'SHA-512',
}

export enum AccountEntryMethod {
    FORM = 'form',
    QR_CODE = 'qr',
}

export enum OTPType {
    TOTP = 'totp',
    HOTP = 'hotp',
}

export enum ThumbnailIconType {
    COLOR = 'color',
    ICON = 'icon',
}

export type Thumbnail = {
    type: ThumbnailIconType
    value: string
}

export enum PINChangeModes {
    SETUP_PIN,
    REMOVE_PIN,
    CHANGE_PIN,
}

export enum TimerIndicatorType {
    NUMBER,
    DISC,
}

export enum Sorting {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type ThumbnailIconAssetType = {
    id: string
    label: string
    src: any
}

export const ICONS: ThumbnailIconAssetType[] = [
    { id: 'MJ9PT6mB', label: 'Amazon', src: require('../../assets/amazon.png') },
    { id: '46Y5Zes4', label: 'BitBucket', src: require('../../assets/bitbucket.png') },
    { id: 'Qfw590Rt', label: 'BitWarden', src: require('../../assets/bitwarden.png') },
    { id: 'oDvVcj0H', label: 'Cardinal Health', src: require('../../assets/cardinal_health.png') },
    { id: 'XbmIDrA3', label: 'CoinDCX', src: require('../../assets/coindcx.png') },
    { id: 'dS5zXk0a', label: 'Dashlane', src: require('../../assets/dashlane.png') },
    { id: 'UCF5n3RM', label: 'Evernote', src: require('../../assets/evernote.png') },
    { id: '48NDtRZ4', label: 'Expo Go', src: require('../../assets/expo_go.png') },
    { id: 'y7JH3dJG', label: 'Facebook', src: require('../../assets/facebook.png') },
    { id: 'h6pOho7H', label: 'GitHub', src: require('../../assets/github.png') },
    { id: 'InnzBAjQ', label: 'Google', src: require('../../assets/google.png') },
    { id: 'llSNA1D4', label: 'Instagram', src: require('../../assets/instagram.png') },
    { id: 'oYyiuuNs', label: 'LinkedIn', src: require('../../assets/linkedin.png') },
    { id: 'PKDLgne6', label: 'Microsoft', src: require('../../assets/microsoft.png') },
    { id: 'SHkBPdbC', label: 'npm', src: require('../../assets/npm.png') },
    { id: 'Y2owJUDn', label: 'Nvidia', src: require('../../assets/nvidia.png') },
    { id: 'VmKQlJBJ', label: 'Olymp Trade', src: require('../../assets/olymp_trade.png') },
    { id: 'rHMphKP4', label: 'Open AI', src: require('../../assets/openai.png') },
    { id: 'VcVQJmBa', label: 'Outlook', src: require('../../assets/outlook.png') },
    { id: 'O8uus57n', label: 'PayPal', src: require('../../assets/paypal.png') },
    { id: 'FBgMm26E', label: 'Proton', src: require('../../assets/proton.png') },
    { id: 'dzNXeRxW', label: 'Rockstar Games', src: require('../../assets/rockstar_games.png') },
    { id: 'OUG3U98V', label: 'Snapchat', src: require('../../assets/snapchat.png') },
    { id: 'OWgaWbgb', label: 'Twitter', src: require('../../assets/twitter.png') },
    { id: 'ihJllg4y', label: 'Upwork', src: require('../../assets/upwork.png') },
]

export const DEFAULT_ALGORITHM = AlgorithmType.SHA1
export const DEFAULT_DIGITS = 6
export const DEFAULT_PERIOD = 30

export const KEY_APP_INTRO_DONE = 'key_app_intro_done'
export const KEY_SETTINGS_APP_LOCK = 'key_settings_app_lock'
export const KEY_SETTINGS_BIOMETRICS = 'key_settings_biometrics'
export const KEY_SETTINGS_PROMPT_BIOMETRICS_ON_START = 'key_settings_prompt_biometrics_on_start'
export const KEY_SETTINGS_DISPLAY_THUMBNAIL = 'key_settings_display_thumbnail'
export const KEY_SETTINGS_TIMER_INDICATOR = 'key_settings_timer_indicator'

export const KEY_MENU_USE_GROUPS = 'key_menu_use_groups'

export const PIN_HASH = 'lock_pin'
export const ENC_KEY = 'tokky-enc-key'
export const ENC_IV = 'tokky-enc-iv'
export const ENC_ALGORITHM = 'aes-256-cbc'
