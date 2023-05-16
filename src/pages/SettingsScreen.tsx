import React, { useEffect, useState } from 'react'
import RootView from '../components/RootView'
import { PreferenceCategory, PreferenceScreen, SwitchPreference } from '../components/PreferenceComponents'
import { UserSettings } from '../utils/UserSettings'
import { Biometrics, BiometricsEnrolledResult } from '../utils/BiometryUtils'

type Props = {}

export default function SettingsScreen(props: Props) {
    const [appLockEnabled, setAppLockEnabled] = useState<boolean>(UserSettings.isAppLockEnabled())
    const [biometricsAvailable, setBiometricsAvailable] = useState(false)

    useEffect(() => {
        Biometrics.enrolled().then((result: BiometricsEnrolledResult) => {
            setBiometricsAvailable(result.isAvailable)
            if (!result.isAvailable) {
                console.log('SettingsScreen: No biometrics enrolled')
            }
        })
    }, [])

    function handleAppLockChange() {
        UserSettings.setAppLockEnabled(!appLockEnabled)
        setAppLockEnabled(enabled => !enabled)
    }

    return (
        <RootView>
            <PreferenceScreen>
                <PreferenceCategory>
                    <SwitchPreference
                        title="Enable App Lock"
                        value={appLockEnabled}
                        onValueChange={handleAppLockChange}
                        disabled={!biometricsAvailable}
                    />
                </PreferenceCategory>
            </PreferenceScreen>
        </RootView>
    )
}
