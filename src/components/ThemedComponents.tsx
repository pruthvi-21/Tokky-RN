import React from 'react'
import {
    Button,
    ButtonProps,
    StyleProp,
    StyleSheet,
    Text,
    TextProps,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from 'react-native'
import { Circle, Path, Polyline, Svg } from 'react-native-svg'
import useTheme from '../Theming'
import { isIOS } from '../utils/Utils'

interface ThemedTextProps extends TextProps {
    type?: 'primary' | 'secondary'
    color?: string
}

interface ThemedButtonProps extends ButtonProps {
    filled?: boolean
}

interface IconButtonProps extends TouchableOpacityProps {
    icon: 'add' | 'edit' | 'delete' | 'down-arrow' | 'overflow-menu' | 'close' | 'chevron-right' | 'keypad-delete' | 'chevron-up-down'
    style?: StyleProp<TextStyle> | undefined
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

export const ThemedButton = (props: ThemedButtonProps) => {
    const theme = useTheme()

    if (props?.filled == true)
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={{
                    borderRadius: 15,
                    flexDirection: 'row',
                    backgroundColor: theme.color.primary_color,
                    marginHorizontal: 7,
                }}
                {...props}>
                <ThemedText style={{ padding: 15, fontSize: 18, flex: 1, textAlign: 'center', color: 'white' }}>{props.title}</ThemedText>
            </TouchableOpacity>
        )

    return <Button color={theme.color.primary_color} {...props} />
}

export const IconButton = ({ icon, ...props }: IconButtonProps) => {
    const { width, height, color, padding } = StyleSheet.flatten(props.style)

    const IconAdd = () => (
        <Svg viewBox="0 0 24 24" width={width} height={height}>
            <Path d="M6,12H12M12,12H18M12,12V18M12,12V6" fillOpacity={0} stroke={color} strokeWidth={1.5} />
        </Svg>
    )

    const IconEdit = () => (
        <Svg viewBox="0 0 24 24" width={width} height={height}>
            <Path
                d="M17.665,10.455L20.755,7.365L16.635,3.245L13.545,6.335M17.665,10.455L7.365,20.755L3.245,20.755L3.245,16.635L13.545,6.335M17.665,10.455L13.545,6.335"
                fillOpacity={0}
                stroke={color}
                strokeWidth={1.5}
            />
        </Svg>
    )

    const IconDelete = () => (
        <Svg viewBox="0 0 24 24" width={width} height={height}>
            <Path
                d="M13.94,11.03L13.94,16.85,M10.06,11.03L10.06,16.85,M4.24,7.15L19.76,7.15,M6.18,7.15L12,7.15L17.82,7.15L17.82,17.82C17.82,19.427 16.517,20.73 14.91,20.73L9.09,20.73C7.483,20.73 6.18,19.427 6.18,17.82L6.18,7.15Z"
                fillOpacity={0}
                stroke={color}
                strokeWidth={1.5}
            />
            <Path
                d="M9.09,5.21C9.09,4.139 9.959,3.27 11.03,3.27L12.97,3.27C14.041,3.27 14.91,4.139 14.91,5.21L14.91,7.15L9.09,7.15L9.09,5.21Z"
                fillOpacity={0}
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

    const IconOverflowMenu = () => {
        if (isIOS())
            return (
                <Svg viewBox="0 0 24 24" width={width} height={width}>
                    <Circle cx={12} cy={12} r={11} fill={'#0000'} stroke={color} strokeWidth={1.8} />
                    <Circle cx={6.5} cy={12} r={1.8} fill={color} />
                    <Circle cx={12} cy={12} r={1.8} fill={color} />
                    <Circle cx={17.5} cy={12} r={1.8} fill={color} />
                </Svg>
            )

        return (
            <Svg viewBox="0 0 24 24" width={width} height={width}>
                <Circle cx={12} cy={5} r={2} fill={color} />
                <Circle cx={12} cy={12} r={2} fill={color} />
                <Circle cx={12} cy={19} r={2} fill={color} />
            </Svg>
        )
    }

    const IconClose = () => {
        return (
            <Svg width={width} height={height} viewBox="0 0 24 24">
                <Path
                    d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        )
    }

    const IconChevronRight = () => {
        return (
            <Svg viewBox="0 0 24 24" width={width} height={height}>
                <Polyline
                    points="8.5 5 15.5 12 8.5 19"
                    fill={'none'}
                    stroke={color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                />
            </Svg>
        )
    }

    const IconKeypadDelete = () => {
        return (
            <Svg viewBox="0 0 24 24" width={width} height={width}>
                <Path
                    fill={color}
                    d="M17.23 9.78L15.01 12L17.23 14.22C17.52 14.51 17.52 14.99 17.23 15.28C17.08 15.43 16.89 15.5 16.7 15.5C16.51 15.5 16.32 15.43 16.17 15.28L13.95 13.06L11.73 15.28C11.58 15.43 11.39 15.5 11.2 15.5C11.01 15.5 10.82 15.43 10.67 15.28C10.38 14.99 10.38 14.51 10.67 14.22L12.89 12L10.67 9.78C10.38 9.49 10.38 9.01 10.67 8.72C10.96 8.43 11.44 8.43 11.73 8.72L13.95 10.94L16.17 8.72C16.46 8.43 16.94 8.43 17.23 8.72C17.52 9.01 17.52 9.49 17.23 9.78ZM21.32 7V17C21.32 17.96 20.54 18.75 19.57 18.75H7.64C7.02999 18.75 6.48 18.44 6.16 17.93L2.87 12.66C2.62 12.26 2.62 11.74 2.87 11.33L6.16 6.07C6.48 5.56 7.04 5.25 7.64 5.25H19.58C20.54 5.25 21.33 6.04 21.33 7H21.32ZM19.82 7C19.82 6.86 19.71 6.75 19.57 6.75H7.64C7.54999 6.75 7.47 6.79 7.43 6.87L4.22 12L7.43 17.13C7.48 17.2 7.56 17.25 7.64 17.25H19.58C19.72 17.25 19.83 17.14 19.83 17V7H19.82Z"
                />
            </Svg>
        )
    }

    const IconChevronUpDown = () => {
        return (
            <Svg
                width={width}
                height={height}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <Path d="M7 15l5 5 5-5" />
                <Path d="M7 9l5-5 5 5" />
            </Svg>
        )
    }

    const Wrapper = (props: any) => {
        if (props.onPress) return <TouchableOpacity {...props}>{props.children}</TouchableOpacity>
        else return <View {...props}>{props.children}</View>
    }

    return (
        <Wrapper {...props}>
            {icon == 'add' && <IconAdd />}
            {icon == 'edit' && <IconEdit />}
            {icon == 'delete' && <IconDelete />}
            {icon == 'down-arrow' && <IconDownArrow />}
            {icon == 'overflow-menu' && <IconOverflowMenu />}
            {icon == 'close' && <IconClose />}
            {icon == 'chevron-right' && <IconChevronRight />}
            {icon == 'keypad-delete' && <IconKeypadDelete />}
            {icon == 'chevron-up-down' && <IconChevronUpDown />}
        </Wrapper>
    )
}
