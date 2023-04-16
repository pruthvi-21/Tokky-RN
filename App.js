import { StatusBar } from "expo-status-bar"
import { styles } from "./styles.js"
import { SafeArea } from "./components/Screen.js"
import HomeScreen from "./pages/HomeScreen.js"

export default function App() {
	return (
		<SafeArea style={styles.safe_area_container}>
			<StatusBar style="light" />
			<HomeScreen />
		</SafeArea>
	)
}
