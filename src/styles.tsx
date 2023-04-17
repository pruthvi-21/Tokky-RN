import { StatusBar, StyleSheet } from "react-native"

const dimens = {
	cornerRadius: 20,
}

const lightTheme = {
	...dimens,
	primary_color: "#669900",
	bg: "#ffffff",
	bg_variant: "#fafafa",
	bg_variant2: "#bababa",
	text_color_primary: "#000000",
	text_color_secondary: "#242424",
	text_color_hint: "#8c8c8c",
}

const darkTheme = {
	...dimens,
	primary_color: "#669900",
	bg: "#010101",
	bg_variant: "#191919",
	bg_variant2: "#333333",
	text_color_primary: "#ffffff",
	text_color_secondary: "#ebebeb",
	text_color_hint: "#939393",
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
	screenHeaderStyle: {
		backgroundColor: theme.bg,
	},
	screenHeaderTitleStyle: {
		color: theme.text_color_primary,
	},
})
