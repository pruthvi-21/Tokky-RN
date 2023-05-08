import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Circle, Svg } from 'react-native-svg'
import useTheme from '../Theming'
import { ThemedText } from './ThemedComponents'

type TimerProps = {
    radius: number
    progress: number
    maxValue: number
}

const Timer = ({ radius, progress, maxValue }: TimerProps) => {
    const theme = useTheme()
    const circumference = 2 * Math.PI * radius

    const numberBased = false

    const styles = StyleSheet.create({
        container: {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: theme.color.primary_color,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

    function NumberCounter() {
        return (
            <View
                style={[
                    styles.container,
                    {
                        width: radius * 2 + 3,
                        height: radius * 2 + 3,
                        backgroundColor: theme.color.bg_variant2,
                    },
                ]}>
                <ThemedText color={theme.color.primary_color}>{progress}</ThemedText>
            </View>
        )
    }

    function CircularCounter() {
        return (
            <View
                style={[
                    styles.container,
                    {
                        transform: [{ rotateZ: '-90deg' }],
                    },
                ]}>
                <Svg>
                    <Circle
                        cx={radius}
                        cy={radius}
                        r={radius}
                        fill={'#0000'}
                        stroke={theme.color.bg_variant2}
                        strokeWidth={radius * 2}
                        strokeDashoffset={(progress * circumference) / maxValue}
                        strokeDasharray={circumference}
                    />
                </Svg>
            </View>
        )
    }

    return <>{numberBased ? <NumberCounter /> : <CircularCounter />}</>
}

export default Timer
