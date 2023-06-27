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
    { id: 'ANc6yKJf', label: 'Amazon', src: require('../../assets/logo_amazon.png') },
    { id: 'V58yAu5y', label: 'Google', src: require('../../assets/logo_google.png') },
    { id: 'rVKaNESD', label: 'Instagram', src: require('../../assets/logo_instagram.png') },
    { id: '2Q5nWnJK', label: 'Microsoft', src: require('../../assets/logo_microsoft.png') },
    { id: 'J0VVGdDt', label: 'Olymp Trade', src: require('../../assets/logo_olymp_trade.png') },
    { id: 'Q8cDYsZ0', label: 'Outlook', src: require('../../assets/logo_outlook.png') },
    { id: 'TIxfx7lc', label: 'Proton', src: require('../../assets/logo_proton.png') },
    { id: 'EjztrhiZ', label: 'Twitter', src: require('../../assets/logo_twitter.png') },
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