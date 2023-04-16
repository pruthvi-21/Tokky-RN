import { View } from "react-native"
import { styles } from "../styles.js"
import Toolbar from "../components/Toolbar.js"

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<Toolbar title="Tokky" />
		</View>
	)
}
