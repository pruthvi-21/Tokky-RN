import { useEffect, useState } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import useTheme, { appTheme } from '../../Theming'
import Account from '../../models/Account'
import Timer from '../Timer'
import { ThemedText } from '../ThemedComponents'

interface Props extends ViewProps {
    account: Account
    isActive: boolean
}

export default function HiddenView({ account, isActive, ...props }: Props) {
    const theme = useTheme()
    const styles = cardStyles(theme)

    const [otp, setOTP] = useState('')
    const [intervalID, setIntervalID] = useState<number[]>([])
    const [progress, setProgress] = useState(0)

    function updateOTP() {
        account.updateOTP()
        setOTP(account.currentOTP)
        setProgress(account.period - (Math.floor(Date.now() / 1000) % account.period))
    }

    function startInterval(): void {
        updateOTP()
        stopInterval()
        const id = setInterval(() => {
            updateOTP()
        }, 1000)
        setIntervalID(ids => [...ids, id])
    }

    function stopInterval(): void {
        intervalID.forEach(id => {
            clearInterval(id)
        })
        setIntervalID([])
    }

    useEffect(() => {
        if (!isActive) {
            stopInterval()
        } else {
            startInterval()
        }
    }, [isActive])

    return (
        <View {...props}>
            <View style={styles.timerContainer}>
                <Timer radius={12} maxValue={account.period} progress={progress} />
            </View>
            <ThemedText style={styles.otpText}>{otp}</ThemedText>
        </View>
    )
}

const cardStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        timerContainer: {
            width: 44,
            marginRight: 20,
            display: 'flex',
            alignItems: 'center',
        },
        otpText: {
            color: theme.color.text_color_primary,
            fontSize: 30,
            marginLeft: 2,
        },
    })
