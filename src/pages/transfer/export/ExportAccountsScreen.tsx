import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { RootStackParamList } from '../../../../App'
import useTheme from '../../../Theming'
import ExportAccountSelection from './ExportAccountSelection'
import ExportTypeScreen from './ExportTypeScreen'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ExportAccountsScreen'>
}

export type ExportStackParamList = {
    ExportAccountSelection: undefined
    ExportTypeScreen: { ids: string[] }
}

function ExportAccountsScreen({}: Props) {
    const theme = useTheme()
    const Stack = createNativeStackNavigator<ExportStackParamList>()

    return (
        <Stack.Navigator>
            <Stack.Screen
                component={ExportAccountSelection}
                name="ExportAccountSelection"
                options={{
                    headerTitle: 'Select Accounts',
                    headerStyle: {
                        backgroundColor: theme.color.modal.bg,
                    },
                    headerTitleStyle: { color: theme.color.text_color_primary },
                }}
            />
            <Stack.Screen
                component={ExportTypeScreen}
                name="ExportTypeScreen"
                options={{
                    headerTitle: 'Export Accounts',
                    headerStyle: {
                        backgroundColor: theme.color.modal.bg,
                    },
                    headerTintColor: theme.color.primary_color,
                    headerTitleStyle: { color: theme.color.text_color_primary },
                }}
            />
        </Stack.Navigator>
    )
}

export default ExportAccountsScreen
