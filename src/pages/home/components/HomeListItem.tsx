import React, { useEffect, useState } from 'react'
import { LayoutAnimation, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ViewProps } from 'react-native'
import { SFSymbol } from 'react-native-sfsymbols'
import useTheme, { appTheme } from '../../../Theming'
import { ThumbnailPreview } from '../../../components/AccountThumbnailController'
import { IconButton, ThemedText } from '../../../components/ThemedComponents'
import Timer from '../../../components/Timer'
import Account from '../../../models/Account'
import { UserSettings } from '../../../utils/UserSettings'

interface Props extends ViewProps {
    account: Account
    currentTime: number
    inEdit: boolean
    editAccountCallback?: (id: string) => void
}

const HomeListItem = ({ account, currentTime, inEdit, editAccountCallback, ...props }: Props) => {
    const theme = useTheme()
    const styles = cardStyles(theme)

    const [isExpanded, setIsExpanded] = useState(false)

    function HiddenView() {
        const [otp, setOTP] = useState('')
        const [progress, setProgress] = useState(account.period - (currentTime % account.period))

        function updateOTP() {
            account.updateOTP()
            setOTP(account.currentOTP)
        }

        useEffect(() => {
            if (isExpanded) {
                updateOTP()
            }
        }, [isExpanded])

        useEffect(() => {
            if (inEdit) toggleExpandState(false)
        }, [inEdit])

        useEffect(() => {
            if (isExpanded) {
                const timeSinceEpoch = Math.floor(currentTime / 1000) % account.period
                const newRemainingTime = account.period - timeSinceEpoch
                if (newRemainingTime == account.period) updateOTP()
                setProgress(newRemainingTime)
            }
        }, [isExpanded, currentTime])

        return (
            <View style={styles.listItemContainer}>
                <View style={styles.timerContainer}>
                    <Timer radius={12} maxValue={account.period} progress={progress} />
                </View>
                <ThemedText style={styles.otpText}>{otp}</ThemedText>
            </View>
        )
    }

    const toggleExpandState = (state: boolean) => {
        LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: 200,
        })
        setIsExpanded(state)
    }

    return (
        <View>
            <TouchableWithoutFeedback
                onPress={() => {
                    if (inEdit) return
                    toggleExpandState(!isExpanded)
                }}>
                <View style={[styles.listItemContainer]}>
                    {UserSettings.isThumbnailDisplayed() && (
                        <View style={styles.preview}>
                            {<ThumbnailPreview size="small" thumb={account.thumbnail} text={account.issuer} />}
                        </View>
                    )}
                    <View style={styles.titleContainer}>
                        <ThemedText style={styles.issuerTextStyle}>{account?.issuer}</ThemedText>
                        {account.label.length !== 0 && (
                            <ThemedText style={styles.labelTextStyle} type="secondary">
                                {account.label}
                            </ThemedText>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {!inEdit && (
                            <SFSymbol
                                style={{ width: 18, padding: 5, transform: [{ rotateX: isExpanded ? '180deg' : '0deg' }] }}
                                size={18}
                                name="chevron.down"
                                color={theme.color.text_color_secondary}
                            />
                        )}
                        {inEdit && (
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => editAccountCallback?.(account.id)}>
                                    <IconButton style={styles.iconEdit} icon={'edit'} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {isExpanded && <HiddenView />}
        </View>
    )
}

const cardStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        listItemContainer: {
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        preview: {
            width: 55,
            height: 37.5,
            borderRadius: 10,
            marginRight: 20,
        },
        titleContainer: {
            flex: 1,
            minHeight: 44,
            justifyContent: 'center',
        },
        issuerTextStyle: {
            fontSize: 17,
        },
        labelTextStyle: {
            marginTop: 3,
        },
        iconEdit: {
            width: 23,
            height: 23,
            color: theme.color.text_color_secondary,
        },
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

export default HomeListItem
