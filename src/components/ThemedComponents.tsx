import React from 'react'
import { Button, ButtonProps, Text, TextProps, TouchableOpacity } from 'react-native'
import useTheme from '../Theming'

interface ThemedTextProps extends TextProps {
    type?: 'primary' | 'secondary'
    color?: string
}

interface ThemedButtonProps extends ButtonProps {
    filled?: boolean
}

export const ThemedText = (props: ThemedTextProps) => {
    const theme = useTheme()
    const { style, type, color, ...restProps } = props

    let textColor = type == 'secondary' ? theme.color.text_color_secondary : theme.color.text_color_primary

    if (color) textColor = color

    return (
        <Text style={[{ color: textColor }, style]} {...restProps}>
            {props.children}
        </Text>
    )
}

export const ThemedButton = (props: ThemedButtonProps) => {
    const theme = useTheme()

    if (props?.filled == true)
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={{
                    borderRadius: 15,
                    flexDirection: 'row',
                    backgroundColor: theme.color.primary_color,
                    marginHorizontal: 7,
                }}
                {...props}>
                <ThemedText style={{ padding: 15, fontSize: 18, flex: 1, textAlign: 'center', color: 'white' }}>{props.title}</ThemedText>
            </TouchableOpacity>
        )

    return <Button color={theme.color.primary_color} {...props} />
}
