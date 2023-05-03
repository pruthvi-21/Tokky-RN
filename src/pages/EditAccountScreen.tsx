import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { RootStackParamList } from '../../App'
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

    const dispatch = useDispatch()

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <ThemedButton title="Save" onPress={handleSaveBtn} />,
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

    return (
        <RootView style={{ paddingHorizontal: 16 }}>
            <FormField
                parentStyle={{ marginTop: 30 }}
                label="Issuer"
                value={issuer}
                placeholder="Company name"
                onChangeText={text => {
                    setIssuer(text)
                }}
            />
            <FormField
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
