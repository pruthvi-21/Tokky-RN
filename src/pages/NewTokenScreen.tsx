import {
	Alert,
	Button,
	GestureResponderEvent,
	KeyboardAvoidingView,
	ScrollView,
	View,
} from "react-native"
import { FormField } from "../components/FormField"
import { isAndroid, isIOS } from "../Utils"
import { useLayoutEffect, useState } from "react"
import useTheme from "../Theming"
import TokenModel from "../models/TokenModel"
import { RootStackParamList } from "../../App"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useDispatch } from "react-redux"
import { addToken } from "../data/action"

type AddTokenScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, "NewTokenScreen">
}

export default function NewTokenScreen({ navigation }: AddTokenScreenProps) {
	const { theme, styles } = useTheme()

	const [issuer, setIssuer] = useState<string>("")
	const [label, setLabel] = useState<string>("")
	const [secretKey, setSecretKey] = useState<string>("")

	const dispatch = useDispatch()

	const saveDetails = (event: GestureResponderEvent) => {
		if (issuer?.length == 0) {
			Alert.alert("Error", "Please enter a issuer name")
			return
		}

		if (secretKey?.length == 0) {
			Alert.alert("Error", "Secret Key can't be empty")
			return
		}
		const newToken = TokenModel.buildToken(issuer, label, secretKey)
		dispatch(addToken(newToken))
		navigation.goBack()
	}

	const SaveBtn = () => (
		<Button title="Add" color={theme.primary_color} onPress={saveDetails} />
	)

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
		<View style={[styles.container, { paddingHorizontal: 16 }]}>
			<ScrollView>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={isIOS() ? "padding" : undefined}
				>
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
					<FormField
						label="Secret Key"
						placeholder="Secret Key"
						onChangeText={handleSecretKeyChange}
					/>
				</KeyboardAvoidingView>
			</ScrollView>
			{isAndroid() && <SaveBtn />}
		</View>
	)
}
