import { StatusBar } from "expo-status-bar"
import { SafeArea } from "./src/components/Screen"
import HomeScreen from "./src/pages/HomeScreen"
import NewTokenScreen from "./src/pages/NewTokenScreen"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import useTheme from "./src/Theming"

export type RootStackParamList = {
	HomeScreen: undefined
	NewTokenScreen: undefined
}

export default function App() {
	const Stack = createNativeStackNavigator<RootStackParamList>()
	const { theme, styles } = useTheme()

	return (
		<SafeArea style={styles.safe_area_container}>
			<StatusBar style="auto" />
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
							headerLargeTitle: true,
						}}
					/>
					<Stack.Screen
						name="NewTokenScreen"
						component={NewTokenScreen}
						options={{
							headerTitle: "New Token",
							headerStyle: styles.screenHeaderStyle,
							headerTitleStyle: styles.screenHeaderTitleStyle,
							headerTintColor: theme.primary_color,
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeArea>
	)
}
