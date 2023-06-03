import { useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import { RootStackParamList } from '../../../App'
import useTheme from '../../Theming'
import { PreferenceCategory, PreferenceScreen, SwitchPreference } from './components/PreferenceComponents'
import RootView from '../../components/RootView'
import { Biometrics, BiometricsEnrolledResult } from '../../utils/BiometryUtils'
import { PINChangeModes } from '../../utils/Constants'
import { UserSettings } from '../../utils/UserSettings'
import UISettings from './UISettings'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SettingsScreen'>
}

export default function SettingsScreen({ navigation }: Props) {
    const theme = useTheme()
    const [biometrics, setBiometrics] = useState<BiometricsEnrolledResult>()

    const [appLockChecked, setAppLockChecked] = useState<boolean>(UserSettings.isAppLockEnabled())
    const [biometricsChecked, setBiometricsChecked] = useState<boolean>(UserSettings.isBiometricsEnabled())
    const [promptBiometricsOnStart, setPromptBiometricsOnStart] = useState(UserSettings.isPromptBiometricsOnStartEnabled())

    const [biometricsDisabled, setBiometricsDisabled] = useState(false)

    useEffect(() => {
        Biometrics.enrolled().then((result: BiometricsEnrolledResult) => {
            setBiometrics(result)
            if (!result.isAvailable) {
                UserSettings.setBiometricsEnabled(false)
                setBiometricsChecked(false)
                console.log('SettingsScreen: No biometrics enrolled')
            }
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            setAppLockChecked(UserSettings.isAppLockEnabled())
        }, []),
    )

    useEffect(() => {
        if (!appLockChecked) {
            setBiometricsChecked(false)
            setBiometricsDisabled(true)
        } else {
            Biometrics.enrolled().then((result: BiometricsEnrolledResult) => {
                setBiometrics(result)
                setBiometricsDisabled(!result.isAvailable)
            })
        }
    }, [appLockChecked])

    function handleAppLockChange() {
        navigation.navigate('ChangePinScreen', { mode: appLockChecked ? PINChangeModes.REMOVE_PIN : PINChangeModes.SETUP_PIN })
    }

    function handleBiometricsChange() {
        UserSettings.setBiometricsEnabled(!biometricsChecked)
        setBiometricsChecked(enabled => !enabled)
    }

    function handlePromptBiometricsOnStartChange() {
        UserSettings.setPromptBiometricsOnStartEmabled(!promptBiometricsOnStart)
        setPromptBiometricsOnStart(enabled => !enabled)
    }

    function getBiometricsPreferenceTitle() {
        if (biometrics?.biometryType == 'FaceID') return 'Face ID'
        if (biometrics?.biometryType == 'TouchID') return 'Touch ID'
        return biometrics?.biometryType
    }

    return (
        <RootView>
            <PreferenceScreen>
                <PreferenceCategory footer={appLockChecked ? 'Please turn off and turn on the app lock in order to change the pin.' : ''}>
                    <SwitchPreference title="Enable App Lock" checked={appLockChecked} onValueChange={handleAppLockChange} />
                </PreferenceCategory>
                <PreferenceCategory
                    title="Biometrics"
                    footer={'Enable this to prompt for ' + getBiometricsPreferenceTitle() + ' as soon as you open the app.'}>
                    <SwitchPreference
                        title={'Unlock with ' + getBiometricsPreferenceTitle()}
                        checked={biometricsChecked}
                        onValueChange={handleBiometricsChange}
                        disabled={biometricsDisabled}
                    />
                    <SwitchPreference
                        title={getBiometricsPreferenceTitle() + ' prompt on startup'}
                        checked={promptBiometricsOnStart}
                        onValueChange={handlePromptBiometricsOnStartChange}
                        disabled={!biometricsChecked || biometricsDisabled}
                    />
                </PreferenceCategory>

                <UISettings />
            </PreferenceScreen>
        </RootView>
    )
}
