import React, { useEffect, useState } from 'react'
import RootView from '../components/RootView'
import { ThemedButton } from '../components/ThemedComponents'
import { Biometrics, BiometricPromptResult, BiometricsEnrolledResult, BiometryType } from '../utils/BiometryUtils'
import { UserSettings } from '../utils/UserSettings'

type Props = {
    callback?: (success: boolean) => void
}

export const AuthScreen = (props: Props) => {
    const [biometryType, setBiometryType] = useState<BiometryType>()

    useEffect(() => {
        if (!UserSettings.isAppLockEnabled()) {
            props.callback?.(true)
        } else {
            Biometrics.enrolled().then((result: BiometricsEnrolledResult) => {
                setBiometryType(result.biometryType)

                if (result.isAvailable) {
                    authenticate()
                } else {
                    props.callback?.(true)
                }
            })
        }
    }, [])

    function authenticate() {
        Biometrics.authenticate('Authenticate to access Tokky')
            .then((result: BiometricPromptResult) => {
                console.log(result)
                props.callback?.(result.success)
            })
            .catch((err: Error) => {
                console.log(err)
            })
    }

    return (
        <RootView style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ThemedButton title="Authenticate" onPress={() => authenticate()} />
        </RootView>
    )
}
