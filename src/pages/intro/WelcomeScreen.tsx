import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import useTheme, { appTheme } from '../../Theming'
import RootView from '../../components/RootView'
import { ThemedButton, ThemedText } from '../../components/ThemedComponents'
import { UserSettings } from '../../utils/UserSettings'
import { IntroStackParamList } from './IntroScreen'
import { KeychainManager } from '../../utils/KeychainManager'
import { ENC_IV, ENC_KEY } from '../../utils/Constants'
import AES from 'react-native-aes-crypto'

type Props = {
    navigation: NativeStackNavigationProp<IntroStackParamList, 'WelcomeScreen'>
}

export const WelcomeScreen = ({ navigation }: Props) => {
    const theme = useTheme()
    const styles = welcomeStyles(theme)

    const [isLoading, setIsLoading] = useState(false)
    const [isWaiting, setIsWaiting] = useState(true)
    const [showProgress, setShowProgress] = useState(false)

    async function handleContinueClick() {
        setIsLoading(true)
        setShowProgress(true)
        setTimeout(() => {
            setIsWaiting(false)
        }, 1000)
        try {
            const key = await AES.randomKey(32) //32 bytes
            const iv = await AES.randomKey(16) //16 bytes
            await KeychainManager.storeKey(ENC_KEY, key, true)
            await KeychainManager.storeKey(ENC_IV, iv, true)

            setIsLoading(false)
        } catch (err) {}
    }

    useEffect(() => {
        if (!isLoading && !isWaiting) {
            setShowProgress(false)
            UserSettings.setAppIntroDone(true)
            navigation.getParent()?.goBack()
        }
    }, [isLoading, isWaiting])

    return (
        <RootView style={styles.container}>
            <ThemedText style={styles.welcomeTitle}>Welcome to Tokky</ThemedText>
            <ThemedText style={styles.paragraphStyle}>This app will help you to create your 2FA tokens.</ThemedText>
            <ThemedText style={styles.paragraphStyle}>
                All the accounts added in Tokky will be encrypted using advanced encryption algorithm and will be stored locally in your
                device.
            </ThemedText>

            <View style={{ flex: 1 }} />

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                {showProgress && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ActivityIndicator color={'white'} style={{ paddingVertical: 15, paddingRight: 9 }} />
                        <ThemedText>Generating keys</ThemedText>
                    </View>
                )}
                <ThemedButton title="Continue" filled={true} onPress={handleContinueClick} disabled={isLoading} />
            </View>
            <View style={{ height: 40 }} />
        </RootView>
    )
}

const welcomeStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.modal.bg,
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        welcomeTitle: {
            fontSize: 34,
            fontWeight: 'bold',
            marginBottom: 15,
            marginTop: 80,
        },
        paragraphStyle: {
            textAlign: 'center',
            marginTop: 20,
            fontSize: 17,
        },
    })
