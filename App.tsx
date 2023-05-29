import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useState } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import useTheme, { appTheme } from './src/Theming'
import SafeArea from './src/components/SafeArea'
import { store } from './src/data/store'
import Account from './src/models/Account'
import { AuthScreen } from './src/pages/AuthScreen'
import { ChangePinScreen } from './src/pages/ChangePinScreen'
import HomeScreen from './src/pages/HomeScreen'
import NewAccountScreen from './src/pages/NewAccountScreen'
import SettingsScreen from './src/pages/settings/SettingsScreen'
import UpdateAccountScreen from './src/pages/UpdateAccountScreen'
import { IntroScreen } from './src/pages/intro/IntroScreen'
import { PINChangeModes } from './src/utils/Constants'

export type RootStackParamList = {
    AuthScreen: undefined
    HomeScreen: undefined
    IntroScreen: undefined
    NewAccountScreen: undefined
    UpdateAccountScreen: { account: Account }
    SettingsScreen: undefined
    ChangePinScreen: { mode: PINChangeModes; hash?: string }
}

export default function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>()

    const theme = useTheme()
    const styles = appStyles(theme)

    return (
        <Provider store={store}>
            <SafeArea>
                <StatusBar />
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="AuthScreen"
                            component={AuthScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="HomeScreen"
                            component={HomeScreen}
                            options={{
                                title: 'Tokky',
                                headerStyle: styles.headerStyle,
                                headerTitleStyle: styles.headerTitleStyle,
                                headerTintColor: theme.color.primary_color,
                                headerLargeTitle: true,
                                headerShadowVisible: false,
                            }}
                        />
                        <Stack.Screen
                            name="IntroScreen"
                            component={IntroScreen}
                            options={{
                                headerShown: false,
                                presentation: 'modal',
                                gestureEnabled: false,
                            }}
                        />
                        <Stack.Screen
                            name="NewAccountScreen"
                            component={NewAccountScreen}
                            options={{
                                headerTitle: 'New Account',
                                headerStyle: styles.headerStyle,
                                headerTitleStyle: styles.headerTitleStyle,
                                headerTintColor: theme.color.primary_color,
                                headerShadowVisible: false,
                            }}
                        />
                        <Stack.Screen
                            name="UpdateAccountScreen"
                            component={UpdateAccountScreen}
                            options={{
                                headerTitle: 'Update account',
                                headerStyle: styles.headerStyleModal,
                                headerTitleStyle: styles.headerTitleStyle,
                                presentation: 'modal',
                                gestureEnabled: false,
                            }}
                        />
                        <Stack.Screen
                            name="SettingsScreen"
                            component={SettingsScreen}
                            options={{
                                headerTitle: 'Settings',
                                headerStyle: styles.headerStyle,
                                headerTitleStyle: styles.headerTitleStyle,
                                headerTintColor: theme.color.primary_color,
                                headerShadowVisible: false,
                            }}
                        />
                        <Stack.Screen
                            name="ChangePinScreen"
                            component={ChangePinScreen}
                            options={{
                                headerTitle: 'Change Pin',
                                headerStyle: styles.headerStyle,
                                headerTitleStyle: styles.headerTitleStyle,
                                headerTintColor: theme.color.primary_color,
                                headerShadowVisible: false,
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeArea>
        </Provider>
    )
}

const appStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        headerStyle: {
            backgroundColor: theme.color.bg,
        },
        headerStyleModal: {
            backgroundColor: theme.color.modal.bg,
        },
        headerTitleStyle: {
            color: theme.color.text_color_primary,
        },
    })
