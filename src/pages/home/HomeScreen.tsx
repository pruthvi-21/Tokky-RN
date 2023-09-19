import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useState } from 'react'
import { ActionSheetIOS, LayoutAnimation, TouchableOpacity, View } from 'react-native'
import { ContextMenuButton } from 'react-native-ios-context-menu'
import { SFSymbol } from 'react-native-sfsymbols'
import { RootStackParamList } from '../../../App'
import useTheme from '../../Theming'
import SafeArea from '../../components/SafeArea'
import { ThemedButton } from '../../components/ThemedComponents'
import { AccountContext } from '../../data/AccountContext'
import DB from '../../data/AccountsDB'
import { UserSettings } from '../../utils/UserSettings'
import AccountsContainer from './components/HomeListContainer'

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
}

function HomeScreen({ navigation }: HomeScreenProps) {
    const theme = useTheme()

    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [inEdit, setInEdit] = useState(false)

    const { accounts, loadAccounts } = useContext(AccountContext)

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
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', width: 100, justifyContent: 'flex-end' }}>
                    {inEdit && (
                        <ThemedButton
                            title="Done"
                            onPress={() => {
                                startLayoutAnimation()
                                setInEdit(false)
                            }}
                        />
                    )}
                    {!inEdit && (
                        <View style={{ flexDirection: 'row' }}>
                            <ContextMenu />
                            <TouchableOpacity onPress={handleFabClick} style={{ marginStart: 8, paddingVertical: 5, paddingStart: 5 }}>
                                <SFSymbol
                                    style={{
                                        width: 24,
                                        height: 24,
                                    }}
                                    name="plus"
                                    color={theme.color.primary_color}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ),
            headerTitle: inEdit ? 'Edit accounts' : 'Tokky',
        })
    }, [inEdit])

    function startLayoutAnimation() {
        LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: 200,
        })
    }

    function ContextMenu() {
        return (
            <ContextMenuButton
                isMenuPrimaryAction={true}
                onPressMenuItem={event => {
                    switch (event.nativeEvent.actionKey) {
                        case 'key-menu-edit':
                            startLayoutAnimation()
                            setInEdit(true)
                            return
                        case 'key-menu-settings':
                            navigation.navigate('SettingsScreen')
                            return
                    }
                }}
                menuConfig={{
                    menuTitle: '',
                    menuItems: [
                        {
                            actionKey: 'key-menu-edit',
                            actionTitle: 'Edit',
                        },
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
                <View style={{ padding: 5 }}>
                    <SFSymbol
                        style={{
                            width: 25.5,
                            height: 25.5,
                        }}
                        name="ellipsis.circle"
                        color={theme.color.primary_color}
                    />
                </View>
            </ContextMenuButton>
        )
    }

    const handleFabClick = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Scan QR code', 'Enter Manually'],
                cancelButtonIndex: 0,
                tintColor: theme.color.primary_color,
            },
            (idx: number) => {
                if (idx == 2) navigation.navigate('NewAccountScreen')
            },
        )
    }

    const handleEditItem = (id: string) => {
        const account = accounts.find(item => item?.id === id)
        if (account != undefined) navigation.navigate('UpdateAccountScreen', { account: account })
    }

    return (
        <SafeArea>
            {isDataLoaded && <AccountsContainer list={accounts} inEdit={inEdit} editAccountCallback={handleEditItem} />}
        </SafeArea>
    )
}

export default HomeScreen
