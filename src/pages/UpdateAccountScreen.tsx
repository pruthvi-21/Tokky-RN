import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { RootStackParamList } from '../../App'
import useTheme, { appTheme } from '../Theming'
import { FormField } from '../components/FormField'
import RootView from '../components/RootView'
import { ThemedButton } from '../components/ThemedComponents'
import { updateAccount } from '../data/action'
import DB from '../database/AccountsDB'
import Account from '../models/Account'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'UpdateAccountScreen'>
    route: RouteProp<RootStackParamList, 'UpdateAccountScreen'>
}

export default function UpdateAccountScreen({ navigation, route }: Props) {
    const account: Account = route.params.account

    const [issuer, setIssuer] = useState<string>(account.issuer)
    const [label, setLabel] = useState<string>(account.label)

    const theme = useTheme()
    const styles = pageStyles(theme)

    const dispatch = useDispatch()

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <ThemedButton title="Cancel" onPress={() => navigation.goBack()} />,
            headerRight: () => <ThemedButton title="Done" onPress={handleSaveBtn} />,
        })
        StatusBar.setBarStyle('light-content', true)
        return () => {
            StatusBar.setBarStyle('default', true)
        }
    }, [navigation, issuer, label])

    async function handleSaveBtn() {
        if (!(issuer == account.issuer && label == account.label)) {
            account.issuer = issuer
            account.label = label

            try {
                await DB.update(account)
                dispatch(updateAccount(account))
            } catch (err) {
                console.log(err)
            }
        }
        navigation.goBack()
    }

    function Divider() {
        return <View style={styles.divider} />
    }

    return (
        <RootView style={styles.root}>
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
                <Divider />
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
