import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import { ContextMenuView } from 'react-native-ios-context-menu'
import useTheme, { appTheme } from '../Theming'
import Account from '../models/Account'
import OTPView from './OTPView'
import { IconButton, ThemedText } from './ThemedComponents'
import { useFocusEffect } from '@react-navigation/native'
import { UserSettings } from '../utils/UserSettings'

type Props = {
    list: Account[]
    editAccountCallback: (id: string) => void
    deleteAccountCallback: (id: string) => void
}

export default function AccountsContainer({ list, editAccountCallback, deleteAccountCallback }: Props) {
    const theme = useTheme()
    const styles = cardStyles(theme)
    const [activeSections, setActiveSections] = useState<number[]>([])
    const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false)

    useFocusEffect(
        useCallback(() => {
            setActiveSections([])
            return () => {
                setActiveSections([])
            }
        }, []),
    )

    const renderHeader = (content: Account, index: number, isActive: boolean) => {
        return (
            <ContextMenuView
                shouldWaitForMenuToHideBeforeFiringOnPressMenuItem={false}
                onPressMenuItem={event => {
                    switch (event.nativeEvent.actionKey) {
                        case 'key-menu-edit':
                            editAccountCallback(list[index].id)
                            return
                        case 'key-menu-delete':
                            deleteAccountCallback(list[index].id)
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
                <View style={[styles.listItemWrapper, { borderTopWidth: isContextMenuVisible ? 0 : index == 0 ? 0 : 1 }]}>
                    <View style={[styles.listItemContainer]}>
                        {UserSettings.isThumbnailDisplayed() && <View style={styles.preview} />}
                        <View style={styles.titleContainer}>
                            <ThemedText style={styles.issuerTextStyle}>{content?.issuer}</ThemedText>
                            {content.label.length !== 0 && (
                                <ThemedText style={styles.labelTextStyle} type="secondary">
                                    {content.label}
                                </ThemedText>
                            )}
                        </View>
                        {!isContextMenuVisible && (
                            <View style={{ transform: [{ rotateZ: isActive ? '180deg' : '0deg' }] }}>
                                <IconButton style={styles.iconArrow} icon="down-arrow" />
                            </View>
                        )}
                    </View>
                </View>
            </ContextMenuView>
        )
    }

    const renderContent = (content: Account, index: number, isActive: boolean) => {
        return <OTPView style={[styles.listItemContainer]} account={content} isActive={isActive} />
    }

    return (
        <View style={[styles.listWrapper]}>
            <Accordion
                activeSections={activeSections}
                sections={list}
                touchableComponent={TouchableOpacity}
                touchableProps={{ activeOpacity: 1 }}
                expandMultiple={false}
                renderHeader={renderHeader}
                renderContent={renderContent}
                duration={200}
                onChange={(section: number[]) => {
                    setActiveSections(section)
                }}
                renderAsFlatList={false}
            />
        </View>
    )
}

const cardStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        listWrapper: {
            borderRadius: 20,
            overflow: 'hidden',
            marginHorizontal: 15,
            marginVertical: 10,
        },
        listItemWrapper: { borderTopColor: theme.color.bg_variant2 },
        listItemContainer: {
            backgroundColor: theme.color.bg_variant,
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
        titleContainer: { flex: 1 },
        issuerTextStyle: { fontSize: 17 },
        labelTextStyle: { marginTop: 3 },
        iconArrow: { width: 20, height: 20, color: theme.color.text_color_secondary },
        iconEdit: { width: 24, height: 24, color: theme.color.text_color_secondary },
        iconDelete: {
            marginStart: 20,
            width: 27,
            height: 27,
            color: theme.color.danger_color,
        },
    })
