import { Button, KeyboardAvoidingView, ScrollView, View } from "react-native"
import { styles, theme } from "../styles.js"
import { FormField } from "../components/FormField.js"
import { isAndroid, isIOS } from "../Utils.js"
import { useState } from "react"

export default function ManualTokenFormScreen({ navigation }) {
	const [issuer, setIssuer] = useState(null)
	const [label, setLabel] = useState(null)
	const [secretKey, setSecretKey] = useState(null)

	const saveDetails = (event) => {}

	return (
		<View
			style={[
				styles.container,
				{ paddingHorizontal: isAndroid() ? 16 : 0 },
			]}
		>
			<ScrollView>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={isIOS() ? "padding" : undefined}
				>
					<FormField
						style={{ marginTop: 30 }}
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
			{isAndroid() && (
				<Button
					title={"Add"}
					color={theme.primary_color}
					onPress={saveDetails}
				/>
			)}
		</View>
	)
}
