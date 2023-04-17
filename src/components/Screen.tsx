import React from "react"
import {
	View,
	SafeAreaView,
	Platform,
	StatusBar,
	StyleSheet,
	ViewProps,
} from "react-native"

const styles = StyleSheet.create({
	container: {
		paddingTop: StatusBar.currentHeight,
	},
})

export const SafeArea = React.memo((props: ViewProps) => {
	if (Platform.OS === "ios") {
		return <SafeAreaView style={props.style}>{props.children}</SafeAreaView>
	}

	return <View style={[styles.container, props.style]}>{props.children}</View>
})
