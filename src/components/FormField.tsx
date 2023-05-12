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
            {/* <View style={{ flex: 1 }} /> */}
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
            width: 120,
            fontSize: 17,
            fontWeight: '800',
            paddingStart: 16,
            paddingEnd: 10,
        },
        textInput: {
            color: theme.color.text_color_primary,
            fontSize: 16,
            textAlign: 'right',
            flex: 1,
            paddingVertical: 15,
            paddingEnd: 16,
        },
    })
