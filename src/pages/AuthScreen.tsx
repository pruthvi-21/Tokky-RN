import React, { useEffect, useState } from 'react'
import RootView from '../components/RootView'
import { ThemedButton } from '../components/ThemedComponents'
import { Biometrics, BiometricsEnrolledResult, BiometryType } from '../utils/BiometryUtils'
import { ENC_KEY } from '../utils/Constants'
import { KeychainManager } from '../utils/KeychainManager'
import { UserSettings } from '../utils/UserSettings'
import { generateRandomKey } from '../utils/Utils'

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

    async function getKeyFromKeychain(): Promise<string | null> {
        try {
            const fetchResult = await KeychainManager.fetchKey(ENC_KEY)
            return fetchResult
        } catch (err) {
            console.info("Key doesn't exist")
            return null
        }
    }

    async function authenticate() {
        const authResult = await Biometrics.authenticate('Authenticate to access Tokky')
        if (authResult.success) {
            let value = await getKeyFromKeychain()
            value && console.log(value)

            if (value == null) {
                const newKey = await generateRandomKey()
                await KeychainManager.storeKey(ENC_KEY, newKey, true)
                value = newKey
            }
        }
        props.callback?.(authResult.success)
    }

    return (
        <RootView style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ThemedButton title="Authenticate" onPress={() => authenticate()} />
        </RootView>
    )
}
