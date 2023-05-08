import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useLayoutEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { RootStackParamList } from '../../App'
import { isAndroid, isIOS } from '../utils/Utils'
import { FormField } from '../components/FormField'
import RootView from '../components/RootView'
import { ThemedButton } from '../components/ThemedComponents'
import { addAccount } from '../data/action'
import DB from '../database/AccountsDB'
import Account from '../models/Account'
import { Base32 } from '../utils/Base32'

type AddAccountScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'NewAccountScreen'>
}

export default function NewAccountScreen({ navigation }: AddAccountScreenProps) {
    const [issuer, setIssuer] = useState<string>('')
    const [label, setLabel] = useState<string>('')
    const [secretKey, setSecretKey] = useState<string>('')

    const dispatch = useDispatch()

    async function createAccount() {
        if (issuer?.length == 0) {
            Alert.alert('Error', 'Please enter a issuer name')
            return
        }

        if (secretKey?.length == 0) {
            Alert.alert('Error', "Secret Key can't be empty")
            return
        }
        try {
            const secretKeyHex = Base32.base32ToHex(secretKey)
            const newAccount = Account.createAccount(issuer, label, secretKeyHex)

            try {
                const rowId = await DB.insert(newAccount)
                if (typeof rowId === 'number' && rowId > 0) dispatch(addAccount(newAccount))
            } catch (err) {
                console.log(err)
                Alert.alert('Error adding item to DB')
            }
            navigation.goBack()
        } catch (er: any) {
            Alert.alert(er.message)
        }
    }

    const SaveBtn = () => <ThemedButton title="Add" onPress={createAccount} />

    useLayoutEffect(() => {
        isIOS() && navigation.setOptions({ headerRight: () => <SaveBtn /> })
    }, [navigation, issuer, label, secretKey])

    const handleIssuerChange = (text: string) => {
        setIssuer(text)
    }
    const handleLabelChange = (text: string) => {
        setLabel(text)
    }
    const handleSecretKeyChange = (text: string) => {
        setSecretKey(text)
    }

    return (
        <RootView style={{ paddingHorizontal: 16 }}>
            <ScrollView>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={isIOS() ? 'padding' : undefined}>
                    <FormField
                        parentStyle={{ marginTop: 30 }}
                        label="Issuer"
                        placeholder="Company name"
                        onChangeText={handleIssuerChange}
                        autoFocus={true}
                    />
                    <FormField label="Label" placeholder="Username or email (Optional)" onChangeText={handleLabelChange} />
                    <FormField label="Secret Key" placeholder="Secret Key" onChangeText={handleSecretKeyChange} />
                </KeyboardAvoidingView>
            </ScrollView>
            {isAndroid() && <SaveBtn />}
        </RootView>
    )
}
