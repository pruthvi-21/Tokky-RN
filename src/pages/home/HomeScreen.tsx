import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { ActionSheetIOS, Alert, View } from 'react-native'
import { ContextMenuButton } from 'react-native-ios-context-menu'
import { useDispatch, useSelector } from 'react-redux'
import { RootStackParamList } from '../../../App'
import useTheme from '../../Theming'
import SafeArea from '../../components/SafeArea'
import { IconButton } from '../../components/ThemedComponents'
import { loadAccounts, removeAccount } from '../../data/action'
import { RootState } from '../../data/reducers'
import DB from '../../database/AccountsDB'
import { UserSettings } from '../../utils/UserSettings'
import AccountsContainer from './components/AccountsContainer'
import FAB from './components/HomeFAB'

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
}

function HomeScreen({ navigation }: HomeScreenProps) {
    const theme = useTheme()

    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [useGroups, setUseGroups] = useState(UserSettings.getMenuUseGroup())

    const dispatch = useDispatch()
    const content = useSelector((state: RootState) => state.accounts)

    useEffect(() => {
        if (!UserSettings.isAppIntroDone()) {
            navigation.navigate('IntroScreen')
        }
        DB.getAll()
            .then(data => {
                dispatch(loadAccounts(data))
                setIsDataLoaded(true)
            })
            .catch(err => {
                console.log('Error fetching data ' + err)
            })
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <ContextMenu />,
            headerTitle: 'Tokky',
        })
    }, [useGroups])

    function ContextMenu() {
        return (
            <ContextMenuButton
                isMenuPrimaryAction={true}
                onPressMenuItem={event => {
                    switch (event.nativeEvent.actionKey) {
                        case 'key-menu-settings':
                            navigation.navigate('SettingsScreen')
                            return
                        case 'key-menu-use-groups':
                            UserSettings.setMenuUseGroups(!UserSettings.getMenuUseGroup())
                            setUseGroups(prev => !prev)
                            break
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
                        {
                            menuTitle: '',
                            menuOptions: ['displayInline'],
                            menuItems: [
                                {
                                    actionTitle: 'Use Groups',
                                    actionKey: 'key-menu-use-groups',
                                    menuState: useGroups ? 'on' : 'off',
                                },
                            ],
                        },
                    ],
                }}>
                <IconButton
                    icon="overflow-menu"
                    style={{
                        width: 22.5,
                        height: 22.5,
                        color: theme.color.primary_color,
                    }}
                />
            </ContextMenuButton>
        )
    }

    const handleFabClick = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Scan QR code', 'Enter Manually', 'Cancel'],
                cancelButtonIndex: 2,
                tintColor: theme.color.primary_color,
            },
            (idx: number) => {
                if (idx == 1) navigation.navigate('NewAccountScreen')
            },
        )
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
        <SafeArea>
            {isDataLoaded && (
                <AccountsContainer
                    list={content}
                    editAccountCallback={handleEditItem}
                    deleteAccountCallback={handleDeleteItem}
                    useGroups={useGroups}
                />
            )}

            {true && <FAB onPress={handleFabClick} />}
        </SafeArea>
    )
}

export default HomeScreen
