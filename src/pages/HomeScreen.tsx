import { useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomSheet, ListItem } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { ActionSheetIOS, Alert, BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootStackParamList } from '../../App'
import useTheme, { appTheme } from '../Theming'
import { isAndroid, isIOS } from '../Utils'
import AccountsContainer from '../components/AccountsContainer'
import FAB from '../components/HomeFAB'
import RootView from '../components/RootView'
import { ThemedButton, ThemedText } from '../components/ThemedComponents'
import { loadAccounts, removeAccount } from '../data/action'
import { RootState } from '../data/reducers'
import DB from '../database/AccountsDB'

type HomeScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
	const theme = useTheme()
	const styles = homeStyles(theme)

	const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
	const [inEditMode, enableEditMode] = useState(false)

	const dispatch = useDispatch()
	const content = useSelector((state: RootState) => state.accounts)

	const fabActions = ['Scan QR code', 'Enter Manually', 'Cancel']

	useEffect(() => {
		DB.getAll().then((data) => {
			dispatch(loadAccounts(data))
		}).catch((err) => {
			console.log("Error fetching data " + err)
		})
	}, [])

    useEffect(() => {
        const toolbarItems = (
            <View style={[styles.toolbarContainer]}>
                {!inEditMode && (
                    <ThemedButton key="key_edit" title="Edit" onPress={() => enableEditMode(true)}/>
                )}
                {inEditMode && (
                    <ThemedButton title="Done" onPress={() => enableEditMode(false)}/>
                )}
            </View>
        )

		navigation.setOptions({
			headerRight: () => toolbarItems,
			headerTitle: !inEditMode ? 'Tokky' : 'Edit Accounts',
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

			return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
		}, [inEditMode])
	)

	const androidList = [
		{ title: fabActions[0], onPress: () => setResult(0) },
		{ title: fabActions[1], onPress: () => setResult(1) },
		{
			title: fabActions[2],
			containerStyle: { backgroundColor: theme.color.danger_color },
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
					tintColor: theme.color.primary_color,
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
				navigation.navigate('NewAccountScreen')
				break
		}
	}

	const handleEditItem = (id: string) => {
		const account = content.find((item) => item?.id === id)
		if (account != undefined) navigation.navigate('EditAccountScreen', { account: account })
	}

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
						DB.remove(id).then(() => {
							dispatch(removeAccount(id))
						})
					},
				},
			]
		)
	}

	return (
		<RootView>
			{isAndroid() && (
				<BottomSheet
					modalProps={{}}
					isVisible={bottomSheetVisible}
					onBackdropPress={() => setBottomSheetVisible(false)}
				>
					{androidList.map((item, i) => (
						<ListItem key={i} containerStyle={item.containerStyle} onPress={item.onPress}>
							<ListItem.Title style={item.titleStyle}>{item.title}</ListItem.Title>
						</ListItem>
					))}
				</BottomSheet>
			)}

			{content.length != 0 && (
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					<AccountsContainer
						inEditMode={inEditMode}
						list={content}
						editAccountCallback={handleEditItem}
						deleteAccountCallback={handleDeleteItem}
					/>
				</ScrollView>
			)}

			{content.length == 0 && (
				<View style={[styles.emptyLayoutContainer]}>
					<ThemedText>No accounts added</ThemedText>
					<ThemedText style={{ marginTop: 5 }}>
						Add a account by clicking on '
						<ThemedText color={theme.color.primary_color} style={{ fontSize: 20 }}>
							+
						</ThemedText>
						' on top
					</ThemedText>
				</View>
			)}

            <FAB onPress={handleFabClick} />
        </RootView>
    )
}

const homeStyles = (theme: typeof appTheme) =>
	StyleSheet.create({
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

		iconAddIOS: {
			width: 36,
			height: 36,
			color: theme.color.primary_color,
			marginStart: 8,
		},
	})
