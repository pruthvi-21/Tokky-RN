import React from "react"
import {
	View,
	Text,
	TextInput,
	TextInputProps,
	ViewStyle,
	StyleProp,
} from "react-native"
import useTheme from "../Theming"

interface Props extends TextInputProps {
	label: string
	parentStyle?: StyleProp<ViewStyle>
}

export const FormField = ({ label, parentStyle, ...props }: Props) => {
	const { theme, styles } = useTheme()
	const { style, ...restProps } = props

	return (
		<View style={[parentStyle]}>
			<Text style={[formStyles.labelTextStyle, styles.textPrimary]}>
				{label}
			</Text>
			<TextInput
				style={[
					formStyles.textInput,
					styles.textPrimary,
					styles.bgVariant,
					styles.borderColor,
					style,
				]}
				placeholderTextColor={theme.text_color_hint}
				selectionColor={theme.primary_color}
				{...restProps}
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
