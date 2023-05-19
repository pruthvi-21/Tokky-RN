import { Settings } from 'react-native'
import { KEY_APP_INTRO_DONE, KEY_SETTINGS_APP_LOCK } from './Constants'

export class UserSettings {
    static get(key: string, defaultValue: any) {
        let value = Settings.get(key)
        if (value == undefined) return defaultValue
        return value
    }

    static set(key: string, value: any) {
        const obj: { [key: string]: any } = {}
        obj[key] = value
        Settings.set(obj)
    }

    static isAppLockEnabled(): boolean {
        return this.get(KEY_SETTINGS_APP_LOCK, false) == 1
    }

    static setAppLockEnabled(value: boolean) {
        this.set(KEY_SETTINGS_APP_LOCK, value)
    }

    static isAppIntroDone(): boolean {
        return this.get(KEY_APP_INTRO_DONE, false) == 1
    }

    static setAppIntroDone(value: boolean) {
        this.set(KEY_APP_INTRO_DONE, value)
    }
}
