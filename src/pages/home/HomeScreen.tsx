import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useState } from 'react'
import { ActionSheetIOS, Alert } from 'react-native'
import { ContextMenuButton } from 'react-native-ios-context-menu'
import { RootStackParamList } from '../../../App'
import useTheme from '../../Theming'
import SafeArea from '../../components/SafeArea'
import { IconButton } from '../../components/ThemedComponents'
import DB from '../../data/AccountsDB'
import { UserSettings } from '../../utils/UserSettings'
import AccountsContainer from './components/AccountsContainer'
import FAB from './components/HomeFAB'
import { AccountContext } from '../../data/AccountContext'

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
}

function HomeScreen({ navigation }: HomeScreenProps) {
    const theme = useTheme()

    const [isDataLoaded, setIsDataLoaded] = useState(false)

    const { accounts, loadAccounts, removeAccount } = useContext(AccountContext)

    useEffect(() => {
        if (!UserSettings.isAppIntroDone()) {
            navigation.navigate('IntroScreen')
        }
        DB.getAll()
            .then(data => {
                loadAccounts(data)
                setIsDataLoaded(true)
            })
            .catch(err => {
                console.log('Error fetching data: ' + err)
            })
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <ContextMenu />,
            headerTitle: 'Tokky',
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
        const account = accounts.find(item => item?.id === id)
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
                    onPress: async () => {
                        try {
                            await removeAccount(id)
                        } catch (err) {
                            Alert.alert('Unable to delete. Please try later.')
                        }
                    },
                },
            ],
        )
    }

    return (
        <SafeArea>
            {isDataLoaded && (
                <AccountsContainer
                    list={accounts}
                    editAccountCallback={handleEditItem}
                    deleteAccountCallback={handleDeleteItem}
                />
            )}

            {true && <FAB onPress={handleFabClick} />}
        </SafeArea>
    )
}

export default HomeScreen
