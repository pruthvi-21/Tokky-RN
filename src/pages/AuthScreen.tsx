import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { RootStackParamList } from '../../App'
import useTheme, { appTheme } from '../Theming'
import Dialpad from '../components/Dialpad'
import PINDotIndicator from '../components/PINDotIndicator'
import RootView from '../components/RootView'
import { ThemedButton, ThemedText } from '../components/ThemedComponents'
import { Biometrics, BiometricsEnrolledResult, BiometryType } from '../utils/BiometryUtils'
import { ENC_KEY, PIN_HASH } from '../utils/Constants'
import { hashPasscode } from '../utils/CryptoUtils'
import { KeychainManager } from '../utils/KeychainManager'
import { UserSettings } from '../utils/UserSettings'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'AuthScreen'>
}

export const AuthScreen = ({ navigation }: Props) => {
    const theme = useTheme()
    const styles = authStyles(theme)

    const [biometrics, setBiometrics] = useState<BiometricsEnrolledResult>()
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [shake, setShake] = useState(false)

    useEffect(() => {
        if (!UserSettings.isAppLockEnabled()) {
            gotoHome()
        } else {
            Biometrics.enrolled().then((result: BiometricsEnrolledResult) => {
                setBiometrics(result)
            })
        }
    }, [])

    function gotoHome() {
        navigation.replace('HomeScreen')
    }

    async function handleOnDigitPress(digit: string) {
        if (digit == 'del') {
            password.length > 0 && setPassword(password.substring(0, password.length - 1))
            return
        }

        if (password.length >= 4) return
        const pass = password + digit
        setPassword(pass)
        if (pass.length == 4) {
            setIsLoading(true)
            const storedHash = await KeychainManager.fetchKey(PIN_HASH)

            const currentHash = await hashPasscode(pass)
            if (currentHash == null) {
                Alert.alert('Error validating the pin')
                return
            }

            if (currentHash == storedHash) {
                setIsLoading(false)
                gotoHome()
            } else {
                setShake(true)
                setIsLoading(false)
                setPassword('')
            }
        }
    }

    async function handleUseBiometrics() {
        const authResult = await Biometrics.authenticate('Authenticate to access Tokky')
        if (authResult.success) gotoHome()
    }

    function getBiometricsButtonTitle(): string {
        if (biometrics?.biometryType == 'FaceID') return 'Unlock with Face ID'
        if (biometrics?.biometryType == 'TouchID') return 'Unlock with Touch ID'
        return ''
    }

    return (
        <RootView style={styles.rootContainer}>
            {isLoading && <Modal transparent={true} />}
            <ThemedText style={styles.title}>Enter your PIN</ThemedText>
            <ThemedButton title={getBiometricsButtonTitle()} onPress={() => handleUseBiometrics()} />
            <ActivityIndicator style={{ marginVertical: 5, opacity: isLoading ? 1 : 0 }} color={theme.color.text_color_primary} />
            <PINDotIndicator
                style={{ marginBottom: 30, marginTop: 10 }}
                length={password.length}
                shake={shake}
                shakeComplete={() => setShake(false)}
            />
            <Dialpad onDigitPress={handleOnDigitPress} />
        </RootView>
    )
}

const authStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        rootContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 25,
            paddingTop: 30,
            paddingBottom: 20,
        },
        summary: {
            paddingVertical: 10,
        },
    })
