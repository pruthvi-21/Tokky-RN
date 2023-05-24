import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { ActionSheetIOS, Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ContextMenuButton } from 'react-native-ios-context-menu'
import { useDispatch, useSelector } from 'react-redux'
import { RootStackParamList } from '../../App'
import useTheme, { appTheme } from '../Theming'
import AccountsContainer from '../components/AccountsContainer'
import FAB from '../components/HomeFAB'
import RootView from '../components/RootView'
import { IconButton, ThemedText } from '../components/ThemedComponents'
import { loadAccounts, removeAccount } from '../data/action'
import { RootState } from '../data/reducers'
import DB from '../database/AccountsDB'
import { UserSettings } from '../utils/UserSettings'

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const theme = useTheme()
    const styles = homeStyles(theme)

    const dispatch = useDispatch()
    const content = useSelector((state: RootState) => state.accounts)

    const fabActions = ['Scan QR code', 'Enter Manually', 'Cancel']

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <ContextMenu />,
            headerTitle: 'Tokky',
        })

        if (!UserSettings.isAppIntroDone()) {
            navigation.navigate('IntroScreen')
        }
        DB.getAll()
            .then(data => {
                dispatch(loadAccounts(data))
            })
            .catch(err => {
                console.log('Error fetching data ' + err)
            })
    }, [])

    function ContextMenu() {
        return (
            <ContextMenuButton
                isMenuPrimaryAction={true}
                onPressMenuItem={event => {
                    switch (event.nativeEvent.actionKey) {
                        case 'key-menu-settings':
                            navigation.navigate('SettingsScreen')
                            return
                    }
                }}
                menuConfig={{
                    menuTitle: '',
                    menuItems: [
                        {
                            actionKey: 'key-menu-settings',
                            actionTitle: 'Settings',
                            icon: {
                                iconType: 'SYSTEM',
                                iconValue: 'gear',
                            },
                        },
                    ],
                }}>
                <IconButton icon="overflow-menu" style={styles.iconOverflowMenu} />
            </ContextMenuButton>
        )
    }

    const handleFabClick = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: [...fabActions],
                cancelButtonIndex: 2,
                tintColor: theme.color.primary_color,
            },
            setResult,
        )
    }

    const setResult = (idx: number) => {
        switch (idx) {
            case 0:
                break
            case 1:
                navigation.navigate('NewAccountScreen')
                break
        }
    }

    const handleEditItem = (id: string) => {
        const account = content.find(item => item?.id === id)
        if (account != undefined) navigation.navigate('UpdateAccountScreen', { account: account })
    }

    const handleDeleteItem = (id: string) => {
        Alert.alert(
            'Warning',
            'Before removing please ensure that you turn off 2FA for this account.\n\n This operation cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel', onPress: () => {} },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        DB.remove(id).then(() => {
                            dispatch(removeAccount(id))
                        })
                    },
                },
            ],
        )
    }

    return (
        <RootView>
            {content.length != 0 && (
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <AccountsContainer list={content} editAccountCallback={handleEditItem} deleteAccountCallback={handleDeleteItem} />
                </ScrollView>
            )}

            {content.length == 0 && (
                <View style={[styles.emptyLayoutContainer]}>
                    <ThemedText>No accounts added</ThemedText>
                    <ThemedText style={{ marginTop: 5 }}>
                        Add a account by clicking on '
                        <ThemedText color={theme.color.primary_color} style={{ fontSize: 20 }}>
                            +
                        </ThemedText>
                        ' on top
                    </ThemedText>
                </View>
            )}

            <FAB onPress={handleFabClick} />
        </RootView>
    )
}

const homeStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        emptyLayoutContainer: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        toolbarContainer: {
            minWidth: 100,
            minHeight: 36,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        iconAddIOS: {
            width: 36,
            height: 36,
            color: theme.color.primary_color,
            marginStart: 8,
        },
        iconOverflowMenu: {
            width: 22.5,
            height: 22.5,
            color: theme.color.primary_color,
        },
    })
