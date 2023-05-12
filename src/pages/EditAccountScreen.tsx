import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
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
    navigation: NativeStackNavigationProp<RootStackParamList, 'EditAccountScreen'>
    route: RouteProp<RootStackParamList, 'EditAccountScreen'>
}

export default function EditAccountScreen({ navigation, route }: Props) {
    const account: Account = route.params.account

    const [issuer, setIssuer] = useState<string>(account.issuer)
    const [label, setLabel] = useState<string>(account.label)

    const theme = useTheme()
    const styles = pageStyles(theme)

    const dispatch = useDispatch()

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <ThemedButton title="Save" onPress={handleSaveBtn} />,
            headerLeft: () => <ThemedButton title="Cancel" onPress={() => navigation.goBack()} />,
        })
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
        </RootView>
    )
}

const pageStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        root: {
            backgroundColor: theme.color.modal.bg,
            paddingTop: 25,
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
