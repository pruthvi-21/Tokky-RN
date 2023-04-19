import React from "react"
import {
	View,
	Text,
	TextInput,
	TextInputProps,
	ViewStyle,
	StyleProp,
	Animated,
} from "react-native"
import useTheme from "../Theming"

interface Props extends TextInputProps {
	label: string
	placeholder?: string
	onTextChange: (text: string) => void
	parentStyle?: StyleProp<ViewStyle>
	mandatoryField?: boolean
}

export const FormField = (props: Props) => {
	const { theme, styles } = useTheme()

	return (
		<View style={[props.parentStyle]}>
			<Text style={[formStyles.labelTextStyle, styles.textPrimary]}>
				{props.label}{" "}
				{props.mandatoryField && (
					<Text style={{ color: theme.error_color, fontSize: 20 }}>
						*
					</Text>
				)}
			</Text>
			<Animated.View>
				<TextInput
					style={[
						props.style,
						formStyles.textInput,
						styles.textPrimary,
						styles.bgVariant,
						styles.borderColor,
					]}
					placeholder={props.placeholder}
					placeholderTextColor={theme.text_color_hint}
					selectionColor={theme.primary_color}
					onChangeText={(text) => props.onTextChange(text)}
				/>
			</Animated.View>
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
