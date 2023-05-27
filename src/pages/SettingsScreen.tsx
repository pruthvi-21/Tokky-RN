import { useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import { RootStackParamList } from '../../App'
import { Preference, PreferenceCategory, PreferenceScreen, SwitchPreference } from '../components/PreferenceComponents'
import RootView from '../components/RootView'
import { Biometrics, BiometricsEnrolledResult } from '../utils/BiometryUtils'
import { PINChangeModes } from '../utils/Constants'
import { UserSettings } from '../utils/UserSettings'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SettingsScreen'>
}

export default function SettingsScreen({ navigation }: Props) {
    const [biometrics, setBiometrics] = useState<BiometricsEnrolledResult>()

    const [appLockChecked, setAppLockChecked] = useState<boolean>(UserSettings.isAppLockEnabled())
    const [biometricsChecked, setBiometricsChecked] = useState<boolean>(UserSettings.isBiometricsEnabled())

    const [pinChangeDisabled, setPinChangeDisabled] = useState(false)
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
        setPinChangeDisabled(!appLockChecked)

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

    function getBiometricsPreferenceTitle() {
        if (biometrics?.biometryType == 'FaceID') return 'Face ID'
        if (biometrics?.biometryType == 'TouchID') return 'Touch ID'
        return biometrics?.biometryType
    }

    return (
        <RootView>
            <PreferenceScreen>
                <PreferenceCategory>
                    <SwitchPreference title="Enable App Lock" value={appLockChecked} onValueChange={handleAppLockChange} />
                    <SwitchPreference
                        title={'Unlock with ' + getBiometricsPreferenceTitle()}
                        value={biometricsChecked}
                        onValueChange={handleBiometricsChange}
                        disabled={biometricsDisabled}
                    />
                </PreferenceCategory>
            </PreferenceScreen>
        </RootView>
    )
}
