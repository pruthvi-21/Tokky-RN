import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import useTheme from '../Theming'
import { IconButton } from './ThemedComponents'

function FAB(props: TouchableOpacityProps) {
    const theme = useTheme()

    return (
        <TouchableOpacity
            style={{
                backgroundColor: theme.color.primary_color,
                padding: 11,
                position: 'absolute',
                bottom: 0,
                right: 0,
                marginRight: 25,
                marginBottom: 20,
                borderRadius: 15,
                elevation: 3,
            }}
            {...props}>
            <IconButton
                style={{
                    width: 30,
                    height: 30,
                    color: '#ffffff',
                }}
                key={'key_add_fab'}
                icon="add"
            />
        </TouchableOpacity>
    )
}

export default FAB
