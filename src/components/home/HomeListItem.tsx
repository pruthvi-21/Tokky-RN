import React, { useState } from 'react'
import { LayoutAnimation, StyleSheet, TouchableWithoutFeedback, View, ViewProps } from 'react-native'
import { ContextMenuView } from 'react-native-ios-context-menu'
import useTheme, { appTheme } from '../../Theming'
import Account from '../../models/Account'
import { UserSettings } from '../../utils/UserSettings'
import OTPView from './OTPView'
import { IconButton, ThemedText } from '../ThemedComponents'

interface Props extends ViewProps {
    accountItem: Account
    editAccountCallback?: (id: string) => void
    deleteAccountCallback?: (id: string) => void
}

const HomeListItem = ({ accountItem, editAccountCallback, deleteAccountCallback, ...props }: Props) => {
    const theme = useTheme()
    const styles = cardStyles(theme)

    const [isExpanded, setIsExpanded] = useState(false)
    const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false)

    const handleToggle = () => {
        LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: 200,
        })
        setIsExpanded(!isExpanded)
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={handleToggle}>
                <ContextMenuView
                    shouldWaitForMenuToHideBeforeFiringOnPressMenuItem={false}
                    onPressMenuItem={event => {
                        switch (event.nativeEvent.actionKey) {
                            case 'key-menu-edit':
                                editAccountCallback?.(accountItem.id)
                                return
                            case 'key-menu-delete':
                                deleteAccountCallback?.(accountItem.id)
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
                        {UserSettings.isThumbnailDisplayed() && <View style={styles.preview} />}
                        <View style={styles.titleContainer}>
                            <ThemedText style={styles.issuerTextStyle}>{accountItem?.issuer}</ThemedText>
                            {accountItem.label.length !== 0 && (
                                <ThemedText style={styles.labelTextStyle} type="secondary">
                                    {accountItem.label}
                                </ThemedText>
                            )}
                        </View>
                        {!isContextMenuVisible && (
                            <IconButton
                                style={[styles.iconArrow, { transform: [{ rotateX: isExpanded ? '180deg' : '0deg' }] }]}
                                icon="down-arrow"
                            />
                        )}
                    </View>
                </ContextMenuView>
            </TouchableWithoutFeedback>

            {isExpanded && (
                <View style={{ overflow: 'hidden' }}>
                    <OTPView style={[styles.listItemContainer]} account={accountItem} isActive={isExpanded} />
                </View>
            )}
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
            width: 44,
            aspectRatio: 1,
            backgroundColor: theme.color.bg_variant2,
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
    })

export default HomeListItem
