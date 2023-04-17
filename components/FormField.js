import React from "react"
import { View, Text, TextInput } from "react-native"
import { theme } from "../styles.js"

const styles = {
	labelTextStyle: {
		color: theme.text_color_primary,
		paddingHorizontal: 10,
	},
	textInput: {
		backgroundColor: theme.bg_variant,
		color: theme.text_color_primary,
		borderColor: theme.bg_variant2,
		borderWidth: 2,
		padding: 11,
		borderRadius: 11,
		fontSize: 16,
		marginVertical: 10,
	},
}

export const FormField = (props) => {
	return (
		<View style={[props.style]}>
			<Text style={styles.labelTextStyle}>{props.label}</Text>
			<TextInput
				style={styles.textInput}
				placeholder={props.placeholder}
				placeholderTextColor={theme.text_color_hint}
				selectionColor={theme.primary_color}
				onChangeText={(text) => props.onTextChange(text)}
			/>
		</View>
	)
}
