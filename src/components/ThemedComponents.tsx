import React from 'react'
import { Button, ButtonProps, StyleSheet, Text, TextProps, TouchableOpacity } from 'react-native'
import useTheme from '../Theming'
import { Path, Svg } from 'react-native-svg'

interface ThemedTextProps extends TextProps {
	type?: 'primary' | 'secondary'
	color?: string
}

interface IconButtonProps extends TextProps {
	icon: 'add' | 'edit' | 'delete' | 'down-arrow'
	tint?: string
}

export const ThemedText = (props: ThemedTextProps) => {
	const theme = useTheme()
	const { style, type, color, ...restProps } = props

	let textColor = type == 'secondary' ? theme.color.text_color_secondary : theme.color.text_color_primary

	if (color) textColor = color

	return (
		<Text style={[{ color: textColor }, style]} {...restProps}>
			{props.children}
		</Text>
	)
}

export const ThemedButton = (props: ButtonProps) => {
	const theme = useTheme()

	return <Button color={theme.color.primary_color} {...props} />
}

export const IconButton = ({ icon, tint, ...props }: IconButtonProps) => {
	const { width, height, color } = StyleSheet.flatten(props.style)

	const IconAdd = () => (
		<Svg viewBox="0 0 24 24" width={width} height={height}>
			<Path d="M6,12H12M12,12H18M12,12V18M12,12V6" stroke={color} strokeWidth={1.5} />
		</Svg>
	)

	const IconEdit = () => (
		<Svg viewBox="0 0 24 24" width={width} height={height}>
			<Path
				d="M17.665,10.455L20.755,7.365L16.635,3.245L13.545,6.335M17.665,10.455L7.365,20.755L3.245,20.755L3.245,16.635L13.545,6.335M17.665,10.455L13.545,6.335"
				stroke={color}
				strokeWidth={1.5}
			/>
		</Svg>
	)

	const IconDelete = () => (
		<Svg viewBox="0 0 24 24" width={width} height={height}>
			<Path
				d="M13.94,11.03L13.94,16.85,M10.06,11.03L10.06,16.85,M4.24,7.15L19.76,7.15,M6.18,7.15L12,7.15L17.82,7.15L17.82,17.82C17.82,19.427 16.517,20.73 14.91,20.73L9.09,20.73C7.483,20.73 6.18,19.427 6.18,17.82L6.18,7.15Z"
				stroke={color}
				strokeWidth={1.5}
			/>
			<Path
				d="M9.09,5.21C9.09,4.139 9.959,3.27 11.03,3.27L12.97,3.27C14.041,3.27 14.91,4.139 14.91,5.21L14.91,7.15L9.09,7.15L9.09,5.21Z"
				stroke={color}
				strokeWidth={1.5}
			/>
		</Svg>
	)

	const IconDownArrow = () => (
		<Svg viewBox="0 0 24 24" width={width} height={width}>
			<Path
				d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
				fill={color}
			/>
		</Svg>
	)

	return (
		<TouchableOpacity {...props}>
			{icon == 'add' && <IconAdd />}
			{icon == 'edit' && <IconEdit />}
			{icon == 'delete' && <IconDelete />}
			{icon == 'down-arrow' && <IconDownArrow />}
		</TouchableOpacity>
	)
}
