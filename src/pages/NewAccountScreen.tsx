import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useLayoutEffect, useState } from 'react'
import { Alert, GestureResponderEvent, KeyboardAvoidingView, ScrollView, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { RootStackParamList } from '../../App'
import { isAndroid, isIOS } from '../Utils'
import { FormField } from '../components/FormField'
import RootView from '../components/RootView'
import { ThemedButton } from '../components/ThemedComponents'
import { addAccount } from '../data/action'
import Account from '../models/Account'

type AddAccountScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'NewAccountScreen'>
}

export default function NewAccountScreen({ navigation }: AddAccountScreenProps) {
	const [issuer, setIssuer] = useState<string>('')
	const [label, setLabel] = useState<string>('')
	const [secretKey, setSecretKey] = useState<string>('')

	const dispatch = useDispatch()

	const saveDetails = (event: GestureResponderEvent) => {
		if (issuer?.length == 0) {
			Alert.alert('Error', 'Please enter a issuer name')
			return
		}

		if (secretKey?.length == 0) {
			Alert.alert('Error', "Secret Key can't be empty")
			return
		}
		const newAccount = Account.createAccount(issuer, label, secretKey)
		dispatch(addAccount(newAccount))
		navigation.goBack()
	}

	const SaveBtn = () => <ThemedButton title="Add" onPress={saveDetails} />

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
					/>
					<FormField
						label="Label"
						placeholder="Username or email (Optional)"
						onChangeText={handleLabelChange}
					/>
					<FormField label="Secret Key" placeholder="Secret Key" onChangeText={handleSecretKeyChange} />
				</KeyboardAvoidingView>
			</ScrollView>
			{isAndroid() && <SaveBtn />}
		</RootView>
	)
}
