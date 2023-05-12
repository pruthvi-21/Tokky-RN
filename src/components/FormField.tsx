import React from 'react'
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native'
import useTheme, { appTheme } from '../Theming'
import { ThemedText } from './ThemedComponents'
import { isIOS } from '../utils/Utils'

interface Props extends TextInputProps {
    label: string
    parentStyle?: StyleProp<ViewStyle>
}

export const FormField = ({ label, parentStyle, ...props }: Props) => {
    const theme = useTheme()
    const { style, ...restProps } = props

    const styles = formStyles(theme)

    return (
        <View style={[styles.container, style]}>
            <ThemedText style={styles.labelTextStyle}>{label}</ThemedText>
            <TextInput
                style={[styles.textInput, style]}
                placeholderTextColor={theme.color.text_color_hint}
                selectionColor={theme.color.primary_color}
                {...restProps}
            />
        </View>
    )
}

const formStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.bg_variant2,
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
        },
        labelTextStyle: {
            paddingHorizontal: 15,
            width: 110,
            fontSize: 17,
            fontWeight: 'bold',
        },
        textInput: {
            flex: 1,
            fontSize: 16,
            padding: 15,
            color: theme.color.text_color_primary,
        },
    })
