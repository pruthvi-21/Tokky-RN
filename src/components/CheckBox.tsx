import React from 'react'
import { ColorValue, TouchableOpacity, View, ViewProps } from 'react-native'
import { SFSymbol } from 'react-native-sfsymbols'
import useTheme from '../Theming'

interface Props extends ViewProps {
    size: number
    value: boolean
    onValueChange?: (value: boolean) => void
    color?: ColorValue
}

const CheckBox = ({ size, color, value, onValueChange, ...props }: Props) => {
    const theme = useTheme()
    const { style, ...rest } = props

    return (
        <TouchableOpacity
            onPress={() => {
                onValueChange?.(!value)
            }}>
            <View
                style={[
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 4,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: value ? theme.color.primary_color : theme.color.text_color_secondary,
                    },
                    style,
                ]}
                {...rest}>
                {value && (
                    <SFSymbol
                        name="checkmark.square.fill"
                        weight="semibold"
                        scale="large"
                        color={color || theme.color.primary_color}
                        size={size - 1}
                        style={{ width: size - 1, height: size - 1 }}
                    />
                )}
            </View>
        </TouchableOpacity>
    )
}

export default CheckBox
