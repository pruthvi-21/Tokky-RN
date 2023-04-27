import { StatusBar } from 'expo-status-bar'
import SafeArea from './src/components/SafeArea'
import HomeScreen from './src/pages/HomeScreen'
import NewTokenScreen from './src/pages/NewTokenScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import useTheme, { appTheme } from './src/Theming'
import { Provider } from 'react-redux'
import { store } from './src/data/store'
import { StyleSheet } from 'react-native'

export type RootStackParamList = {
	HomeScreen: undefined
	NewTokenScreen: undefined
}

export default function App() {
	const Stack = createNativeStackNavigator<RootStackParamList>()

	const theme = useTheme()
	const styles = appStyles(theme)

	return (
		<Provider store={store}>
			<SafeArea>
				<StatusBar style="auto" />
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="HomeScreen"
							component={HomeScreen}
							options={{
								title: 'Tokky',
								headerStyle: styles.headerStyle,
								headerTitleStyle: styles.headerTitleStyle,
								headerTintColor: theme.color.primary_color,
								headerLargeTitle: true,
							}}
						/>
						<Stack.Screen
							name="NewTokenScreen"
							component={NewTokenScreen}
							options={{
								headerTitle: 'New Token',
								headerStyle: styles.headerStyle,
								headerTitleStyle: styles.headerTitleStyle,
								headerTintColor: theme.color.primary_color,
							}}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</SafeArea>
		</Provider>
	)
}

const appStyles = (theme: typeof appTheme) =>
	StyleSheet.create({
		headerStyle: {
			backgroundColor: theme.color.bg,
		},
		headerTitleStyle: {
			color: theme.color.text_color_primary,
		},
	})
