import {
	ActionSheetIOS,
	BackHandler,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native"
import { FAB } from "@rneui/themed"
import { BottomSheet, ListItem } from "@rneui/themed"
import React, { useEffect, useState } from "react"
import { isAndroid, isIOS } from "../Utils"
import useTheme from "../Theming"
import TokensContainer from "../components/TokensContainer"
import { Path, Svg } from "react-native-svg"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import { Text } from "react-native-animatable"
import { useFocusEffect } from "@react-navigation/native"
import { useSelector } from "react-redux"
import { RootState } from "../data/reducers"

type HomeScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, "HomeScreen">
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
	const { theme, styles } = useTheme()
	const [isVisible, setIsVisible] = useState(false)
	const [inEditMode, enableEditMode] = useState(false)

	const content = useSelector((state: RootState) => state.tokenList)

	const fabActions = ["Scan QR code", "Enter Manually", "Cancel"]

	const IOSAddIcon = () => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={handleFabClick}
				style={{ marginStart: 15 }}
			>
				<Svg viewBox="0 0 24 24" width={36} height={36}>
					<Path
						d="M6,12H12M12,12H18M12,12V18M12,12V6"
						stroke={theme.primary_color}
						strokeWidth={1.5}
					/>
				</Svg>
			</TouchableOpacity>
		)
	}

	const IconEdit = () => {
		return (
			<TouchableOpacity activeOpacity={0.5} onPress={handleEditClick}>
				<Text style={{ fontSize: 18, color: theme.primary_color }}>
					Edit
				</Text>
			</TouchableOpacity>
		)
	}

	const IconDone = () => {
		return (
			<TouchableOpacity activeOpacity={0.5} onPress={handleDoneClick}>
				<Text
					style={{
						fontSize: 17,
						color: theme.primary_color,
						fontWeight: "600",
					}}
				>
					Done
				</Text>
			</TouchableOpacity>
		)
	}

	useEffect(() => {
		const toolbarItems = (
			//Due to some unknown reason when we enter into Edit mode
			//the Done button is not properly aligned to the right
			//So wrapped it around a view instead and done manually
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "flex-end",
					minWidth: 100,
					minHeight: 36,
				}}
			>
				{!inEditMode && <IconEdit key={"key_edit"} />}
				{isIOS() && !inEditMode && <IOSAddIcon key={"key_add"} />}
				{inEditMode && <IconDone key={"key_done"} />}
			</View>
		)

		navigation.setOptions({
			headerRight: () => toolbarItems,
			headerTitle: !inEditMode ? "Tokky" : "Edit Tokens",
		})
	}, [inEditMode])

	//Listen to Back button. if inEditMode = true, then set to false
	useFocusEffect(
		React.useCallback(() => {
			const onBackPress = () => {
				if (inEditMode) {
					enableEditMode(false)
					return true
				}
				return false
			}

			BackHandler.addEventListener("hardwareBackPress", onBackPress)

			return () =>
				BackHandler.removeEventListener(
					"hardwareBackPress",
					onBackPress
				)
		}, [inEditMode])
	)

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

	const handleEditClick = () => {
		enableEditMode(true)
	}
	const handleDoneClick = () => {
		enableEditMode(false)
	}

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
				navigation.navigate("NewTokenScreen")
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
				<TokensContainer inEditMode={inEditMode} content={content} />
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
