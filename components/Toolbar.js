import { theme } from "../styles.js"
import { StyleSheet, Text, View } from "react-native"

const toolbarStyle = StyleSheet.create({
	container: {
		height: 56,
		justifyContent: "center",
		margin: 0,
		paddingHorizontal: 16,
	},
	title: {
		color: theme.text_color_primary,
		fontSize: 20,
	},
})

export default (props) => {
	return (
		<View style={toolbarStyle.container}>
			<Text style={toolbarStyle.title}>{props.title}</Text>
		</View>
	)
}
