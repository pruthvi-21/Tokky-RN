import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SFSymbol } from 'react-native-sfsymbols'
import useTheme, { appTheme } from '../../../Theming'

interface DialpadProps {
    onDigitPress?: (digit: string) => void
}

const DIGIT_BTN_SIZE = 80

const Dialpad: React.FC<DialpadProps> = ({ onDigitPress }) => {
    const theme = useTheme()
    const styles = dialpadStyle(theme)

    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

    const DigitButton = (digit: string) => {
        return (
            <TouchableOpacity key={digit} style={styles.digitButton} onPress={() => onDigitPress?.(digit)}>
                <Text style={styles.digitButtonText}>{digit}</Text>
            </TouchableOpacity>
        )
    }

    const DeleteButton = () => {
        return (
            <View key={'del'} style={[styles.dummy, { alignItems: 'center', justifyContent: 'center' }]}>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => onDigitPress?.('del')}>
                    <SFSymbol name="delete.left" color={theme.color.text_color_primary} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>
        )
    }

    const renderDigitButtons = () => {
        const rows: ReactElement[] = []
        let row: ReactElement[] = []
        let rowIndex = 0

        digits.forEach(digit => {
            row.push(DigitButton(digit))

            if (row.length === 3) {
                rows.push(
                    <View key={rowIndex} style={styles.digitsRow}>
                        {row}
                    </View>,
                )
                row = []
                rowIndex++
            }
        })

        row.push(<View key={'dummy'} style={styles.dummy} />) //dummy button
        row.push(DigitButton('0'))
        row.push(DeleteButton())
        rows.push(
            <View key={'4'} style={[styles.digitsRow, { alignItems: 'flex-end' }]}>
                {row}
            </View>,
        )

        return rows
    }

    return <View style={styles.container}>{renderDigitButtons()}</View>
}

const dialpadStyle = (theme: typeof appTheme) =>
    StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        digitsRow: {
            flexDirection: 'row',
        },
        digitButton: {
            width: DIGIT_BTN_SIZE,
            aspectRatio: 1 / 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 7,
            marginHorizontal: 10,
            borderRadius: DIGIT_BTN_SIZE / 2,
            backgroundColor: theme.color.keypad_btn_bg,
        },
        digitButtonText: {
            fontSize: 30,
            fontWeight: '500',
            color: theme.color.text_color_primary,
        },
        dummy: {
            width: DIGIT_BTN_SIZE,
            aspectRatio: 1,
            marginVertical: 7,
            marginHorizontal: 10,
        },
    })

export default Dialpad
