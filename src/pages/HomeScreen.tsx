import { ActionSheetIOS, Alert, Platform, View } from "react-native"
import { FAB } from "@rneui/themed"
import { BottomSheet, ListItem } from "@rneui/themed"
import { useState } from "react"
import { isAndroid, isIOS } from "../Utils"
import useTheme from "../Theming"

export default function HomeScreen({ navigation }) {
	const {theme, styles} = useTheme()
	const [isVisible, setIsVisible] = useState(false)
	const fabActions = ["Scan QR code", "Enter Manually", "Cancel"]

	const androidList = [
		{ title: fabActions[0], onPress: () => setResult(0) },
		{ title: fabActions[1], onPress: () => setResult(1) },
		{
			title: fabActions[2],
			containerStyle: { backgroundColor: "#ff0000" },
			titleStyle: { color: "white" },
			onPress: () => setResult(2),
		},
	]

	const handleFabClick = () => {
		isIOS() && (
			ActionSheetIOS.showActionSheetWithOptions({
				options: [...fabActions],
				cancelButtonIndex: 2,
			},
			setResult
		))

		isAndroid() && setIsVisible(true)
	}

	const setResult = (idx: number) => {
		setIsVisible(false)
		switch (idx) {
			case 0:
				break
			case 1:
				navigation.navigate("NewScreen")
				break
		}
	}

	return (
		<View style={styles.container}>
			<BottomSheet
				modalProps={{}}
				isVisible={isVisible}
				onBackdropPress={() => setIsVisible(false)}
			>
				{androidList.map((item, i) => (
					<ListItem
						key={i}
						containerStyle={item.containerStyle}
						onPress={item.onPress}
					>
						<ListItem.Title style={item.titleStyle}>
							{item.title}
						</ListItem.Title>
					</ListItem>
				))}
			</BottomSheet>

			<FAB
				onPress={handleFabClick}
				placement="right"
				icon={{ name: "add", color: "white" }}
				color={theme.primary_color}
			/>
		</View>
	)
}
