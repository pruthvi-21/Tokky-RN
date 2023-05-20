import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import useTheme, { appTheme } from '../../Theming'
import RootView from '../../components/RootView'
import { ThemedButton, ThemedText } from '../../components/ThemedComponents'
import { UserSettings } from '../../utils/UserSettings'
import { IntroStackParamList } from './IntroScreen'

type Props = {
    navigation: NativeStackNavigationProp<IntroStackParamList, 'WelcomeScreen'>
    route: RouteProp<IntroStackParamList, 'WelcomeScreen'>
}

export const WelcomeScreen = ({ navigation, route }: Props) => {
    const theme = useTheme()
    const styles = welcomeStyles(theme)

    function handleContinueClick() {
        UserSettings.setAppIntroDone(true)
        navigation.getParent()?.goBack()
    }

    return (
        <RootView style={styles.container}>
            <ThemedText style={styles.welcomeTitle}>Welcome to Tokky</ThemedText>
            <ThemedText style={styles.paragraphStyle}>This app will help you to create your 2FA tokens.</ThemedText>
            <ThemedText style={styles.paragraphStyle}>
                All the accounts added in Tokky will be encrypted using advanced encryption algorithm and will be stored locally in your
                device.
            </ThemedText>

            <View style={{ flex: 1 }} />

            <ThemedButton title="Continue" filled={true} onPress={handleContinueClick} />
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
