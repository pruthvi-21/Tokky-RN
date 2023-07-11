import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RootStackParamList } from '../../App'
import useTheme, { appTheme } from '../Theming'
import AccountThumbnailController from '../components/AccountThumbnailController'
import { FormField } from '../components/FormField'
import RootView from '../components/RootView'
import SafeArea from '../components/SafeArea'
import { ThemedButton } from '../components/ThemedComponents'
import { AccountContext } from '../data/AccountContext'
import Account from '../models/Account'
import { Thumbnail } from '../utils/Constants'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'UpdateAccountScreen'>
    route: RouteProp<RootStackParamList, 'UpdateAccountScreen'>
}

export default function UpdateAccountScreen({ navigation, route }: Props) {
    const account: Account = route.params.account

    const [thumbnail, setThumbnail] = useState<Thumbnail>(account.thumbnail)
    const [issuer, setIssuer] = useState<string>(account.issuer)
    const [label, setLabel] = useState<string>(account.label)

    const theme = useTheme()
    const styles = pageStyles(theme)

    const { accounts, updateAccount, removeAccount } = useContext(AccountContext)

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <ThemedButton title="Cancel" onPress={() => navigation.goBack()} />,
            headerRight: () => <ThemedButton title="Done" onPress={handleSaveBtn} />,
        })
        StatusBar.setBarStyle('light-content', true)
        return () => {
            StatusBar.setBarStyle('default', true)
        }
    }, [navigation, issuer, label, thumbnail])

    async function handleSaveBtn() {
        const existingAccount = accounts.find((acc: Account) => acc.issuer + acc.label === issuer + label && acc.id !== account.id)
        if (existingAccount) {
            Alert.alert('Error', 'Account name already exists. Please choose a different name')
            return
        }

        try {
            updateAccount(account, { issuer, label, thumbnail })
        } catch (err) {
            console.log(err)
        }
        navigation.goBack()
    }

    function handleDelete() {
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
                            await removeAccount(account.id)
                            navigation.goBack()
                        } catch (err) {
                            Alert.alert('Unable to delete. Please try later.')
                        }
                    },
                },
            ],
        )
    }

    function DeleteCTA() {
        return (
            <TouchableOpacity
                style={{ backgroundColor: theme.color.danger_color + 22, padding: 13, borderRadius: 11 }}
                onPress={handleDelete}>
                <Text style={{ color: theme.color.danger_color, fontSize: 16, paddingStart: 10, textAlign: 'center' }}>Delete Account</Text>
            </TouchableOpacity>
        )
    }

    return (
        <RootView style={styles.root}>
            <SafeArea style={{ backgroundColor: 'transparent' }}>
                <AccountThumbnailController
                    style={{ marginTop: 25 }}
                    text={issuer}
                    thumb={thumbnail}
                    onChange={(thumb: Thumbnail) => {
                        setThumbnail(thumb)
                    }}
                />
                <View style={{ borderRadius: 11, overflow: 'hidden' }}>
                    <FormField
                        style={styles.textInputStyle}
                        label="Issuer"
                        value={issuer}
                        placeholder="Company name"
                        onChangeText={text => {
                            setIssuer(text)
                        }}
                    />
                    <View style={styles.divider} />
                    <FormField
                        style={styles.textInputStyle}
                        label="Label"
                        value={label}
                        placeholder="Username or email (Optional)"
                        onChangeText={text => {
                            setLabel(text)
                        }}
                    />
                </View>
                <View style={{ flex: 1 }} />
                <DeleteCTA />
            </SafeArea>
        </RootView>
    )
}

const pageStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        root: {
            backgroundColor: theme.color.modal.bg,
            paddingTop: 25,
            paddingHorizontal: 15,
        },
        divider: {
            height: 1.5,
            backgroundColor: theme.color.modal.bg_variant2,
        },
        textInputStyle: {
            backgroundColor: theme.color.modal.bg_variant,
            borderColor: theme.color.modal.bg_variant2,
        },
    })
