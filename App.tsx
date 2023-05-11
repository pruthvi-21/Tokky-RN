import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Button, StatusBar, StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import useTheme, { appTheme } from './src/Theming'
import SafeArea from './src/components/SafeArea'
import { store } from './src/data/store'
import Account from './src/models/Account'
import EditAccountScreen from './src/pages/EditAccountScreen'
import HomeScreen from './src/pages/HomeScreen'
import NewAccountScreen from './src/pages/NewAccountScreen'
import SettingsScreen from './src/pages/SettingsScreen'

export type RootStackParamList = {
    HomeScreen: undefined
    NewAccountScreen: undefined
    EditAccountScreen: { account: Account }
    SettingsScreen: undefined
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
                            name="HomeScreen"
                            component={HomeScreen}
                            options={{
                                title: 'Tokky',
                                headerStyle: styles.headerStyle,
                                headerTitleStyle: styles.headerTitleStyle,
                                headerTintColor: theme.color.primary_color,
                                headerLargeTitle: true,
                            }}
                        />
                        <Stack.Screen
                            name="NewAccountScreen"
                            component={NewAccountScreen}
                            options={{
                                headerTitle: 'New Account',
                                headerStyle: styles.headerStyleModal,
                                headerTitleStyle: styles.headerTitleStyle,
                                presentation: 'modal',
                                gestureEnabled: false,
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
