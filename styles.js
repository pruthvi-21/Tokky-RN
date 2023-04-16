import { StatusBar, StyleSheet } from "react-native"

const dimens = {
	cornerRadius: 20,
}

const lightTheme = {
	...dimens,
	primary_color: "#669900",
	bg: "#ffffff",
	bg_variant: "#fafafa",
	text_color_primary: "#000000",
	text_color_secondary: "#242424",
}

const darkTheme = {
	...dimens,
	primary_color: "#669900",
	bg: "#010101",
	bg_variant: "#191919",
	text_color_primary: "#ffffff",
	text_color_secondary: "#ebebeb",
}

export const theme = darkTheme

export const styles = StyleSheet.create({
	safe_area_container: {
		flex: 1,
		backgroundColor: theme.bg,
	},
	container: {
		flex: 1,
		backgroundColor: theme.bg,
	},
})
