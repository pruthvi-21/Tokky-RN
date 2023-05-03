import React from 'react'
import { View, ViewProps } from 'react-native'
import useTheme from '../Theming'

const RootView = (props: ViewProps) => {
    const theme = useTheme()

    return <View style={[{ flex: 1, backgroundColor: theme.color.bg }, props.style]}>{props.children}</View>
}

export default React.memo(RootView)
