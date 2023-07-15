import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { RootStackParamList } from '../../../App'
import useTheme, { appTheme } from '../../Theming'
import RootView from '../../components/RootView'
import { ThemedButton, ThemedText } from '../../components/ThemedComponents'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ImportAccountsScreen'>
}

function ImportAccountsScreen({ navigation }: Props) {
    const theme = useTheme()
    const styles = importStyles(theme)

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <ThemedButton
                    title="Cancel"
                    onPress={() => {
                        navigation.goBack()
                    }}
                />
            ),
        })
    }, [])

    return (
        <RootView style={{ backgroundColor: theme.color.modal.bg, paddingHorizontal: 25 }}>
            <TouchableOpacity style={styles.actionButtonContainer} onPress={() => {}}>
                <ThemedText style={styles.actionButtonText}>Scan QR code</ThemedText>
            </TouchableOpacity>
        </RootView>
    )
}

const importStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        textInputContainer: {
            borderRadius: 11,
            backgroundColor: theme.color.modal.bg_variant,
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        textInput: {
            height: 200,
            color: theme.color.text_color_primary,
            fontSize: 16,
        },
        actionButtonContainer: {
            backgroundColor: theme.color.modal.bg_variant,
            borderRadius: 15,
            marginTop: 20,
        },
        actionButtonText: {
            paddingVertical: 17.5,
            textAlign: 'center',
            fontSize: 16,
            color: theme.color.primary_color,
        },
    })

export default ImportAccountsScreen
