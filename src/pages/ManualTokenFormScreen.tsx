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
import { useState } from "react"
import useTheme from "../Theming"

export default function ManualTokenFormScreen({ navigation }) {
	const { theme, styles } = useTheme()

	const [issuer, setIssuer] = useState<string | null>(null)
	const [label, setLabel] = useState<string | null>(null)
	const [secretKey, setSecretKey] = useState<string | null>(null)

	const saveDetails = (event: GestureResponderEvent) => {
		if (issuer == null || issuer?.length == 0) {
			Alert.alert("Error", "Please enter a issuer name")
			return
		}

		if (secretKey == null || secretKey?.length == 0) {
			Alert.alert("Error", "Secret Key can't be empty")
			return
		}
		//Save details
	}

	const SaveBtn = () => (
		<Button title="Add" color={theme.primary_color} onPress={saveDetails} />
	)

	isIOS() && navigation.setOptions({ headerRight: () => <SaveBtn /> })

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
						onTextChange={setIssuer}
					/>
					<FormField
						label="Label"
						placeholder="Username or email (Optional)"
						onTextChange={setLabel}
					/>
					<FormField
						label="Secret Key"
						placeholder="Secret Key"
						onTextChange={setSecretKey}
					/>
				</KeyboardAvoidingView>
			</ScrollView>
			{isAndroid() && <SaveBtn />}
		</View>
	)
}
