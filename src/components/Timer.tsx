import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Circle, Svg } from 'react-native-svg'
import useTheme from '../Theming'
import { TimerIndicatorType } from '../utils/Constants'
import { UserSettings } from '../utils/UserSettings'
import { ThemedText } from './ThemedComponents'

type TimerProps = {
    radius: number
    progress: number
    maxValue: number
    type?: TimerIndicatorType
}

const Timer = ({ radius, progress, maxValue, ...props }: TimerProps) => {
    const theme = useTheme()
    const circumference = 2 * Math.PI * radius

    let type = TimerIndicatorType.DISC
    if (props.type === undefined) {
        type = UserSettings.getTimerIndicator()
    } else {
        type = props.type
    }

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
                        width: radius * 2,
                        height: radius * 2,
                        backgroundColor: theme.color.bg_variant2,
                    },
                ]}>
                <ThemedText style={{ fontSize: radius }} color={theme.color.primary_color}>
                    {progress}
                </ThemedText>
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

    return <>{type == TimerIndicatorType.NUMBER ? <NumberCounter /> : <CircularCounter />}</>
}

export default Timer
