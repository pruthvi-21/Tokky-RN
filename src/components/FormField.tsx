import React from "react"
import { View, Text, TextInput, ViewProps } from "react-native"
import useTheme from "../Theming";

interface Props extends ViewProps {
	label: string;
	placeholder?: string;
	onTextChange: (text: string) => void
}

export const FormField = (props: Props) => {
	const {theme, styles} = useTheme()
	return (
		<View style={[props.style]}>
			<Text style={[formStyles.labelTextStyle, styles.textPrimary]}>{props.label}</Text>
			<TextInput
				style={[formStyles.textInput, styles.textPrimary, styles.borderColor, styles.bgVariant]}
				placeholder={props.placeholder}
				placeholderTextColor={theme.text_color_hint}
				selectionColor={theme.primary_color}
				onChangeText={(text) => props.onTextChange(text)}
			/>
		</View>
	)
}

const formStyles = {
	labelTextStyle: {
		paddingHorizontal: 10,
	},
	textInput: {
		borderWidth: 2,
		padding: 11,
		borderRadius: 11,
		fontSize: 16,
		marginVertical: 10,
	},
}