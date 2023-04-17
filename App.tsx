import { StatusBar } from "expo-status-bar"
import { styles, theme } from "./src/styles"
import { SafeArea } from "./src/components/Screen"
import HomeScreen from "./src/pages/HomeScreen"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ManualTokenFormScreen from "./src/pages/ManualTokenFormScreen"
import { Button } from "react-native"
import { isIOS } from "./src/Utils"

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
