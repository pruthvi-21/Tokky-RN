import {
	ActionSheetIOS,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native"
import { FAB } from "@rneui/themed"
import { BottomSheet, ListItem } from "@rneui/themed"
import { useEffect, useState } from "react"
import { isAndroid, isIOS } from "../Utils"
import useTheme from "../Theming"
import TokenCard from "../components/TokenCard"
import { Path, Svg } from "react-native-svg"

export default function HomeScreen({ navigation }) {
	const { theme, styles } = useTheme()
	const [isVisible, setIsVisible] = useState(false)
	const fabActions = ["Scan QR code", "Enter Manually", "Cancel"]

	useEffect(() => {
		isIOS() &&
			navigation.setOptions({
				headerRight: () => (
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={handleFabClick}
					>
						<Svg viewBox="0 0 24 24" width={36} height={36}>
							<Path
								d="M6,12H12M12,12H18M12,12V18M12,12V6"
								stroke={theme.primary_color}
								strokeWidth={1.5}
							/>
						</Svg>
					</TouchableOpacity>
				),
			})
	}, [])

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
		isIOS() &&
			ActionSheetIOS.showActionSheetWithOptions(
				{
					options: [...fabActions],
					cancelButtonIndex: 2,
					tintColor: theme.primary_color,
				},
				setResult
			)

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
			{isAndroid() && (
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
			)}

			<ScrollView contentInsetAdjustmentBehavior="automatic">
				<TokenCard />
			</ScrollView>

			{isAndroid() && (
				<FAB
					onPress={handleFabClick}
					placement="right"
					icon={{ name: "add", color: "white" }}
					color={theme.primary_color}
				/>
			)}
		</View>
	)
}
