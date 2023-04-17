import { StatusBar } from "expo-status-bar"
import { styles, theme } from "./styles.js"
import { SafeArea } from "./components/Screen.js"
import HomeScreen from "./pages/HomeScreen.js"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ManualTokenFormScreen from "./pages/ManualTokenFormScreen.js"
import { Button } from "react-native"
import { isIOS } from "./Utils.js"

export default function App() {
	const Stack = createNativeStackNavigator()

	const ButtonX = () => {
		return <Button title="Add" color={theme.primary_color} />
	}

	return (
		<SafeArea style={styles.safe_area_container}>
			<StatusBar style="light" />
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="HomeScreen"
						component={HomeScreen}
						options={{
							title: "Tokky",
							headerStyle: styles.screenHeaderStyle,
							headerTitleStyle: styles.screenHeaderTitleStyle,
							headerTintColor: theme.primary_color,
						}}
					/>
					<Stack.Screen
						name="NewScreen"
						component={ManualTokenFormScreen}
						options={{
							headerTitle: "New Token",
							headerStyle: styles.screenHeaderStyle,
							headerTitleStyle: styles.screenHeaderTitleStyle,
							headerTintColor: theme.primary_color,
							headerRight: isIOS() ? ButtonX : undefined,
							headerBackTitle: "Back",
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeArea>
	)
}
