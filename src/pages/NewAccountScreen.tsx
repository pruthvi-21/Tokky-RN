import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { RootStackParamList } from '../../App'
import useTheme, { appTheme } from '../Theming'
import { FormField } from '../components/FormField'
import PickerDial from '../components/PickerDial'
import RootView from '../components/RootView'
import { ThemedText } from '../components/ThemedComponents'
import { addAccount } from '../data/action'
import DB from '../database/AccountsDB'
import Account from '../models/Account'
import { Base32 } from '../utils/Base32'
import { DEFAULT_DIGITS, DEFAULT_PERIOD, isIOS } from '../utils/Utils'
import { AlgorithmType } from '../utils/Constants'

type AddAccountScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'NewAccountScreen'>
}

export default function NewAccountScreen({ navigation }: AddAccountScreenProps) {
    const [issuer, setIssuer] = useState<string>('')
    const [label, setLabel] = useState<string>('')
    const [secretKey, setSecretKey] = useState<string>('')

    const [algo, setAlgo] = useState<string>('sha1')
    const [digits, setDigits] = useState<number>(DEFAULT_DIGITS)
    const [period, setPeriod] = useState<string>(DEFAULT_PERIOD + '')

    const theme = useTheme()
    const styles = pageStyles(theme)

    const dispatch = useDispatch()

    const algorithm_options = [
        { label: 'SHA-1 (Default)', value: 'sha1', key: '1', inputLabel: 'SHA-1' },
        { label: 'SHA-256', value: 'sha256', key: '2', inputLabel: 'SHA-256' },
        { label: 'SHA-512', value: 'sha512', key: '3', inputLabel: 'SHA-512' },
    ]

    const digits_options = [
        { label: '4 digits', value: 4, key: '1' },
        { label: '5 digits', value: 5, key: '2' },
        { label: '6 digits', value: 6, key: '3' },
        { label: '7 digits', value: 7, key: '4' },
        { label: '8 digits', value: 8, key: '5' },
    ]

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

            let algoType: AlgorithmType = 'SHA-1'
            if (algo == 'sha256') algoType = 'SHA-256'
            if (algo == 'sha512') algoType = 'SHA-512'

            const newAccount = Account.createAccount(issuer, label, secretKeyHex, algoType, digits, parseInt(period))

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

    const handleIssuerChange = (text: string) => {
        setIssuer(text)
    }
    const handleLabelChange = (text: string) => {
        setLabel(text)
    }
    const handleSecretKeyChange = (text: string) => {
        setSecretKey(text)
    }

    function Divider() {
        return <View style={styles.divider} />
    }

    return (
        <RootView style={[isIOS() && styles.root]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={isIOS() ? 'padding' : undefined}>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={{ height: 25 }} />
                    <View style={{ borderRadius: 11, overflow: 'hidden' }}>
                        <FormField
                            style={styles.textInputStyle}
                            parentStyle={{ marginTop: 30 }}
                            label="Issuer"
                            placeholder="Company name"
                            onChangeText={handleIssuerChange}
                        />
                        <Divider />
                        <FormField
                            style={styles.textInputStyle}
                            label="Label"
                            placeholder="Username or email (Optional)"
                            onChangeText={handleLabelChange}
                        />
                    </View>
                    <View style={{ borderRadius: 11, overflow: 'hidden', marginTop: 25 }}>
                        <FormField
                            style={styles.textInputStyle}
                            label="Secret Key"
                            placeholder="Secret Key"
                            onChangeText={handleSecretKeyChange}
                        />
                    </View>

                    <View style={styles.adv_layout_container}>
                        <ThemedText style={styles.adv_layout_title}>Advanced options</ThemedText>
                        <ThemedText style={styles.adv_layout_summary}>
                            Changing these options may cause unexpected consequences. Leave defaults if unsure.
                        </ThemedText>
                    </View>

                    <View style={{ borderRadius: 11, overflow: 'hidden' }}>
                        <PickerDial
                            title={'Algorithm'}
                            onValueChange={value => setAlgo(value)}
                            items={algorithm_options}
                            value={algo}
                            fieldValue={algorithm_options.find(item => item.value === algo)!.inputLabel}
                        />
                        <Divider />
                        <PickerDial
                            title={'Length'}
                            onValueChange={value => setDigits(value)}
                            items={digits_options}
                            value={digits}
                            fieldValue={digits_options.find(item => item.value === digits)!.label}
                        />
                        <Divider />
                        <FormField
                            style={styles.textInputStyle}
                            label="Period"
                            placeholder="Period"
                            value={period}
                            inputMode="numeric"
                            onChangeText={value => setPeriod(value)}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity activeOpacity={0.7} style={styles.buttonStyle} onPress={createAccount}>
                <ThemedText style={styles.buttonTextStyle}>Done</ThemedText>
            </TouchableOpacity>
        </RootView>
    )
}

const pageStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        root: {
            paddingHorizontal: 15,
        },
        divider: {
            height: 1.5,
            backgroundColor: theme.color.divider_color,
        },
        textInputStyle: {
            backgroundColor: theme.color.bg_variant,
            borderColor: theme.color.bg_variant2,
        },
        adv_layout_container: {
            marginTop: 40,
            marginBottom: 25,
        },
        adv_layout_title: {
            fontSize: 17,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        adv_layout_summary: {
            color: theme.color.text_color_secondary,
            marginTop: 10,
            textAlign: 'center',
        },
        buttonStyle: {
            borderRadius: 15,
            flexDirection: 'row',
            backgroundColor: theme.color.primary_color,
            marginHorizontal: 7,
            marginTop: 15,
            marginBottom: 20,
        },
        buttonTextStyle: {
            padding: 15,
            fontSize: 18,
            flex: 1,
            textAlign: 'center',
            color: 'white',
        },
    })
