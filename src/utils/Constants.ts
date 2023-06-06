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
