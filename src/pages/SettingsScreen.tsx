import React, { useState } from 'react'
import RootView from '../components/RootView'
import { PreferenceCategory, PreferenceScreen, SwitchPreference } from '../components/PreferenceComponents'
import { UserSettings } from '../utils/UserSettings'

type Props = {}

export default function SettingsScreen(props: Props) {
    const [appLockEnabled, setAppLockEnabled] = useState<boolean>(UserSettings.isAppLockEnabled())

    function handleAppLockChange() {
        UserSettings.setAppLockEnabled(!appLockEnabled)
        setAppLockEnabled(enabled => !enabled)
    }

    return (
        <RootView>
            <PreferenceScreen>
                <PreferenceCategory>
                    <SwitchPreference title="Enable App Lock" value={appLockEnabled} onValueChange={handleAppLockChange} />
                </PreferenceCategory>
            </PreferenceScreen>
        </RootView>
    )
}
