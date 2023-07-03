import React, { useEffect, useState } from 'react'
import { LayoutAnimation, StyleSheet, TouchableWithoutFeedback, View, ViewProps } from 'react-native'
import { ContextMenuView } from 'react-native-ios-context-menu'
import useTheme, { appTheme } from '../../../Theming'
import { ThumbnailPreview } from '../../../components/AccountThumbnailController'
import { IconButton, ThemedText } from '../../../components/ThemedComponents'
import Timer from '../../../components/Timer'
import Account from '../../../models/Account'
import { UserSettings } from '../../../utils/UserSettings'

interface Props extends ViewProps {
    account: Account
    isActive: boolean
    currentTime: number
    onExpand: (accountId: string) => void
    editAccountCallback?: (id: string) => void
    deleteAccountCallback?: (id: string) => void
}

const HomeListItem = ({ account, isActive, currentTime, editAccountCallback, deleteAccountCallback, ...props }: Props) => {
    const theme = useTheme()
    const styles = cardStyles(theme)

    const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false)

    function HiddenView() {
        const [otp, setOTP] = useState('')
        const [progress, setProgress] = useState(account.period - (currentTime % account.period))

        function updateOTP() {
            account.updateOTP()
            setOTP(account.currentOTP)
        }

        useEffect(() => {
            if (isActive) {
                updateOTP()
            }
        }, [isActive])

        useEffect(() => {
            if (isActive) {
                const timeSinceEpoch = Math.floor(currentTime / 1000) % account.period
                const newRemainingTime = account.period - timeSinceEpoch
                if (newRemainingTime == account.period) updateOTP()
                setProgress(newRemainingTime)
            }
        }, [isActive, currentTime])

        return (
            <View style={styles.listItemContainer}>
                <View style={styles.timerContainer}>
                    <Timer radius={12} maxValue={account.period} progress={progress} />
                </View>
                <ThemedText style={styles.otpText}>{otp}</ThemedText>
            </View>
        )
    }

    const handleToggle = () => {
        LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: 200,
        })
        props.onExpand(account.id)
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={handleToggle}>
                <ContextMenuView
                    shouldWaitForMenuToHideBeforeFiringOnPressMenuItem={false}
                    onPressMenuItem={event => {
                        switch (event.nativeEvent.actionKey) {
                            case 'key-menu-edit':
                                editAccountCallback?.(account.id)
                                return
                            case 'key-menu-delete':
                                deleteAccountCallback?.(account.id)
                        }
                    }}
                    onMenuWillShow={() => {
                        setIsContextMenuVisible(true)
                    }}
                    onMenuWillHide={() => {
                        setIsContextMenuVisible(false)
                    }}
                    menuConfig={{
                        menuTitle: '',
                        menuItems: [
                            {
                                actionKey: 'key-menu-edit',
                                actionTitle: 'Edit',
                            },
                            {
                                actionKey: 'key-menu-delete',
                                actionTitle: 'Delete Account',
                                menuAttributes: ['destructive'],
                                icon: {
                                    iconType: 'SYSTEM',
                                    iconValue: 'trash',
                                },
                            },
                        ],
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
                        {!isContextMenuVisible && (
                            <IconButton
                                style={[styles.iconArrow, { transform: [{ rotateX: isActive ? '180deg' : '0deg' }] }]}
                                icon="down-arrow"
                            />
                        )}
                    </View>
                </ContextMenuView>
            </TouchableWithoutFeedback>

            {isActive && <HiddenView />}
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
        iconArrow: {
            width: 20,
            height: 20,
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
