import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, ViewProps } from 'react-native'
import useTheme from '../Theming'

const SafeArea = (props: ViewProps) => {
	const theme = useTheme()

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			paddingTop: StatusBar.currentHeight,
			backgroundColor: theme.color.bg,
		},
	})

	return <SafeAreaView style={[styles.container, props.style]}>{props.children}</SafeAreaView>
}

export default React.memo(SafeArea)
