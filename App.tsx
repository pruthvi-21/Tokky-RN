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
import EditAccountScreen from './src/pages/EditAccountScreen'
import HomeScreen from './src/pages/HomeScreen'
import NewAccountScreen from './src/pages/NewAccountScreen'
import SettingsScreen from './src/pages/SettingsScreen'
import { IntroScreen } from './src/pages/intro/IntroScreen'

export type RootStackParamList = {
    HomeScreen: undefined
    IntroScreen: undefined
    NewAccountScreen: undefined
    EditAccountScreen: { account: Account }
    SettingsScreen: undefined
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const Stack = createNativeStackNavigator<RootStackParamList>()

    const theme = useTheme()
    const styles = appStyles(theme)

    function handleAuthorization(success: boolean) {
        setIsAuthenticated(success)
    }

    return (
        <Provider store={store}>
            <SafeArea>
                <StatusBar />
                {!isAuthenticated ? (
                    <AuthScreen callback={handleAuthorization} />
                ) : (
                    <NavigationContainer>
                        <Stack.Navigator>
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
                                name="EditAccountScreen"
                                component={EditAccountScreen}
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
                        </Stack.Navigator>
                    </NavigationContainer>
                )}
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
