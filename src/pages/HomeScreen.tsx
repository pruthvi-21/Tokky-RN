import {
	ActionSheetIOS,
	Alert,
	BackHandler,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native'
import { FAB } from '@rneui/themed'
import { BottomSheet, ListItem } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { isAndroid, isIOS } from '../Utils'
import useTheme from '../Theming'
import TokensContainer from '../components/TokensContainer'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../data/reducers'
import { removeToken } from '../data/action'
import {
	ThemedButton,
	IconButton,
	ThemedText,
} from '../components/ThemedComponents'

type HomeScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
	const { theme, styles } = useTheme()
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
	const [inEditMode, enableEditMode] = useState(false)

	const dispatch = useDispatch()
	const content = useSelector((state: RootState) => state.tokenList)

	const fabActions = ['Scan QR code', 'Enter Manually', 'Cancel']

	useEffect(() => {
		const toolbarItems = (
			//Due to some unknown reason when we enter into Edit mode
			//the Done button is not properly aligned to the right
			//So wrapped it around a view instead and done manually
			<View style={[homeStyles.toolbarContainer]}>
				{!inEditMode && (
					<ThemedButton
						key="key_edit"
						title="Edit"
						onPress={() => enableEditMode(true)}
					/>
				)}
				{isIOS() && !inEditMode && (
					<IconButton
						key={'key_add'}
						icon="add"
						width={36}
						height={36}
						tint={theme.primary_color}
						onPress={handleFabClick}
					/>
				)}
				{inEditMode && (
					<ThemedButton
						title="Done"
						onPress={() => enableEditMode(false)}
					/>
				)}
			</View>
		)

		navigation.setOptions({
			headerRight: () => toolbarItems,
			headerTitle: !inEditMode ? 'Tokky' : 'Edit Tokens',
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

			BackHandler.addEventListener('hardwareBackPress', onBackPress)

			return () =>
				BackHandler.removeEventListener(
					'hardwareBackPress',
					onBackPress
				)
		}, [inEditMode])
	)

	const androidList = [
		{ title: fabActions[0], onPress: () => setResult(0) },
		{ title: fabActions[1], onPress: () => setResult(1) },
		{
			title: fabActions[2],
			containerStyle: { backgroundColor: '#ff0000' },
			titleStyle: { color: 'white' },
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

		isAndroid() && setBottomSheetVisible(true)
	}

	const setResult = (idx: number) => {
		setBottomSheetVisible(false)
		switch (idx) {
			case 0:
				break
			case 1:
				navigation.navigate('NewTokenScreen')
				break
		}
	}

	const handleEditItem = (id: string) => {}

	const handleDeleteItem = (id: string) => {
		Alert.alert(
			'Warning',
			'Before removing please ensure that you turn off 2FA for this account.\n\n This operation cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel', onPress: () => {} },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						dispatch(removeToken(id))
					},
				},
			]
		)
	}

	return (
		<View style={[styles.container]}>
			{isAndroid() && (
				<BottomSheet
					modalProps={{}}
					isVisible={bottomSheetVisible}
					onBackdropPress={() => setBottomSheetVisible(false)}
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

			{content.length != 0 && (
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					<View>
						<TokensContainer
							inEditMode={inEditMode}
							content={content}
							editTokenCallback={handleEditItem}
							deleteTokenCallback={handleDeleteItem}
						/>
					</View>
				</ScrollView>
			)}

			{content.length == 0 && (
				<View style={[homeStyles.emptyLayoutContainer]}>
					<ThemedText>No accounts added</ThemedText>
					<ThemedText style={{ marginTop: 5 }}>
						Add a account by clicking on '
						<ThemedText
							color={theme.primary_color}
							style={{ fontSize: 20 }}
						>
							+
						</ThemedText>
						' on top
					</ThemedText>
				</View>
			)}

			{isAndroid() && (
				<FAB
					onPress={handleFabClick}
					placement="right"
					icon={{ name: 'add', color: 'white' }}
					color={theme.primary_color}
				/>
			)}
		</View>
	)
}

const homeStyles = StyleSheet.create({
	emptyLayoutContainer: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	toolbarContainer: {
		minWidth: 100,
		minHeight: 36,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
})
