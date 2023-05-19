import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { View } from 'react-native-animatable'
import useTheme from '../../Theming'
import { WelcomeScreen } from './WelcomeScreen'

export type IntroStackParamList = {
    WelcomeScreen: undefined
}

export const IntroScreen = () => {
    const theme = useTheme()

    const IntroStack = createNativeStackNavigator<IntroStackParamList>()

    return (
        <IntroStack.Navigator>
            <IntroStack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
                options={{
                    header: () => <View />,
                    headerTintColor: theme.color.primary_color,
                    headerStyle: { backgroundColor: theme.color.modal.bg },
                    headerShadowVisible: false,
                }}
            />
        </IntroStack.Navigator>
    )
}
