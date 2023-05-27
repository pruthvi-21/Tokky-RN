import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import AES from 'react-native-aes-crypto'
import { RootStackParamList } from '../../App'
import useTheme, { appTheme } from '../Theming'
import Dialpad from '../components/Dialpad'
import PINDotIndicator from '../components/PINDotIndicator'
import RootView from '../components/RootView'
import { ThemedButton, ThemedText } from '../components/ThemedComponents'
import { PINChangeModes, PIN_HASH } from '../utils/Constants'
import { hashPasscode } from '../utils/CryptoUtils'
import { KeychainManager } from '../utils/KeychainManager'
import { UserSettings } from '../utils/UserSettings'

type ChangePinScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ChangePinScreen'>
    route: RouteProp<RootStackParamList, 'ChangePinScreen'>
}

export const ChangePinScreen = ({ navigation, route }: ChangePinScreenProps) => {
    const theme = useTheme()
    const styles = authStyles(theme)

    const [pin, setPin] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [shake, setShake] = useState(false)

    function getHeaderTitle(): string {
        if (route.params.mode === PINChangeModes.SETUP_PIN) return 'Setup PIN'
        else if (route.params.mode === PINChangeModes.REMOVE_PIN) return 'Remove PIN'
        else if (route.params.mode === PINChangeModes.CHANGE_PIN) return 'Update PIN'
        return ''
    }

    function getTitle(): string {
        if (route.params.mode === PINChangeModes.SETUP_PIN) {
            return route.params.hash == undefined ? 'Enter a 4-digit PIN' : 'Re-enter your pin'
        } else if (route.params.mode === PINChangeModes.REMOVE_PIN) return 'Enter your current pin'
        return ''
    }

    useEffect(() => {
        navigation.setOptions({
            headerBackVisible: false,
            headerTitle: getHeaderTitle(),
            headerRight: () => (
                <ThemedButton
                    title="Cancel"
                    onPress={() => {
                        navigation.goBack()
                    }}
                />
            ),
        })
    }, [])

    function returnToSettings() {
        setTimeout(() => {
            navigation.goBack()
        }, 200)
    }

    async function handleOnDigitPress(digit: string) {
        if (digit == 'del') {
            pin.length > 0 && setPin(pin.substring(0, pin.length - 1))
            return
        }

        if (pin.length >= 4) return
        const passcode = pin + digit
        setPin(passcode)

        if (passcode.length !== 4) {
            return
        }

        switch (route.params.mode) {
            case PINChangeModes.SETUP_PIN:
                const isConfirmPage = route.params.hash !== undefined
                const passHash = await AES.sha1(passcode)

                if (!isConfirmPage) {
                    navigation.replace('ChangePinScreen', { mode: PINChangeModes.SETUP_PIN, hash: passHash })
                    return
                }

                setIsVerifying(true)

                if (passHash !== route.params.hash) {
                    setIsVerifying(false)
                    setShake(true)
                    setPin('')
                    return
                }

                const hashedPass = await hashPasscode(passcode)
                if (hashedPass == null) {
                    setIsVerifying(false)
                    Alert.alert('Unable to verify passcode')
                    returnToSettings()
                    return
                }

                await KeychainManager.storeKey(PIN_HASH, hashedPass, true)
                UserSettings.setAppLockEnabled(true)
                returnToSettings()

                setIsVerifying(false)
                break
            case PINChangeModes.REMOVE_PIN:
                setIsVerifying(true)
                const storedHash = await KeychainManager.fetchKey(PIN_HASH)
                const currentHash = await hashPasscode(passcode)

                if (currentHash == storedHash) {
                    UserSettings.setAppLockEnabled(false)
                    returnToSettings()
                } else {
                    setShake(true)
                    setPin('')
                }
                setIsVerifying(false)
                break
        }
    }

    return (
        <RootView style={styles.rootContainer}>
            <ThemedText style={styles.title}>{getTitle()}</ThemedText>
            <ActivityIndicator style={{ marginVertical: 5, opacity: isVerifying ? 1 : 0 }} color={theme.color.text_color_primary} />
            <PINDotIndicator style={styles.pinIndicator} length={pin.length} shake={shake} shakeComplete={() => setShake(false)} />
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
            fontSize: 20,
            paddingVertical: 30,
            textAlign: 'center',
        },
        pinIndicator: {
            margin: 30,
        },
    })
