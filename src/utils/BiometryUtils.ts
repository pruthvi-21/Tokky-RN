import { NativeModules } from 'react-native'

export type BiometryType = 'TouchID' | 'FaceID' | 'Biometrics' | undefined

export interface BiometricsEnrolledResult {
    isAvailable: boolean
    biometryType?: BiometryType
    error?: string
}

export interface BiometricPromptResult {
    success: boolean
    error?: string
}

type BiometricsAuthType = {
    enrolled: () => Promise<BiometricsEnrolledResult>
    authenticate: (message: string) => Promise<BiometricPromptResult>
}

export const Biometrics: BiometricsAuthType = NativeModules.BiometricAuth
