import React, { useEffect, useState } from 'react'
import { Animated, Easing, StyleSheet, View, ViewProps } from 'react-native'
import useTheme, { appTheme } from '../Theming'

interface PasswordInputProps extends ViewProps {
    length: number
    shake?: boolean
    shakeComplete?: () => void
}

function PINDotIndicator({ length, ...props }: PasswordInputProps) {
    const theme = useTheme()
    const styles = inputStyles(theme)
    const { style, ...restProps } = props

    const shakeAnim = useState(new Animated.Value(0))[0]

    useEffect(() => {
        if (props.shake == true) {
            Animated.timing(shakeAnim, {
                toValue: 1,
                duration: 200,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }).start(() => {
                shakeAnim.setValue(0)
                props.shakeComplete?.()
            })
        }
    }, [props.shake])

    return (
        <View style={style} {...restProps}>
            <Animated.View
                style={[
                    styles.dotsContainer,
                    {
                        transform: [
                            {
                                translateX: shakeAnim.interpolate({
                                    inputRange: [0, 0.333, 0.666, 1],
                                    outputRange: [0, -15, 15, 0],
                                }),
                            },
                        ],
                    },
                ]}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <View key={index} style={[styles.dot, index < length && styles.dotActive, props.shake && styles.dotError]} />
                ))}
            </Animated.View>
        </View>
    )
}

const inputStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        dotsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        dot: {
            width: 16,
            aspectRatio: 1,
            borderRadius: 10,
            backgroundColor: theme.color.bg_variant2,
            marginHorizontal: 9,
        },
        dotActive: {
            backgroundColor: theme.color.primary_color,
        },
        dotError: {
            backgroundColor: theme.color.danger_color + 'bb',
        },
    })

export default PINDotIndicator
