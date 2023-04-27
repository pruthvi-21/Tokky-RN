import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import useTheme, { appTheme } from '../Theming'
import Accordion from 'react-native-collapsible/Accordion'
import * as Animatable from 'react-native-animatable'
import TokenModel from '../models/TokenModel'
import { ThemedText, IconButton } from './ThemedComponents'

type Props = {
	inEditMode: boolean
	list: TokenModel[]
	editTokenCallback: (id: string) => void
	deleteTokenCallback: (id: string) => void
}

export default function TokensContainer({ inEditMode, list, editTokenCallback, deleteTokenCallback }: Props) {
	const theme = useTheme()
	const styles = cardStyles(theme)

	const [activeSections, setActiveSections] = useState<number[]>([])

	useEffect(() => {
		setActiveSections([])
	}, [inEditMode])

	const renderHeader = (content: TokenModel, index: number, isActive: boolean) => {
		return (
			<View style={[styles.listItemWrapper, { borderTopWidth: index == 0 ? 0 : 1 }]}>
				<View style={[styles.listItemContainer]}>
					<View style={styles.preview} />
					<View style={styles.titleContainer}>
						<ThemedText style={styles.issuerTextStyle}>{content.issuer}</ThemedText>
						<ThemedText style={styles.labelTextStyle} type="secondary">
							{content.label}
						</ThemedText>
					</View>
					{!inEditMode && (
						<View style={{ transform: [{ rotateZ: isActive ? '180deg' : '0deg' }] }}>
							<IconButton style={styles.iconArrow} icon="down-arrow" />
						</View>
					)}
					{inEditMode && (
						<IconButton
							style={styles.iconEdit}
							icon="edit"
							onPress={() => editTokenCallback(list[index].id)}
						/>
					)}
					{inEditMode && (
						<IconButton
							style={styles.iconDelete}
							icon="delete"
							onPress={() => deleteTokenCallback(list[index].id)}
						/>
					)}
				</View>
			</View>
		)
	}

	const renderContent = (content: TokenModel, index: number, isActive: boolean) => {
		return (
			<View style={[styles.listItemContainer]}>
				<Animatable.Text style={styles.otpText} animation={isActive ? 'fadeIn' : undefined} duration={500}>
					{'123 456'}
				</Animatable.Text>
			</View>
		)
	}

	return (
		<View style={[styles.listWrapper]}>
			<Accordion
				activeSections={activeSections}
				sections={list}
				touchableComponent={inEditMode ? View : TouchableOpacity}
				touchableProps={{ activeOpacity: 1 }}
				expandMultiple={false}
				renderHeader={renderHeader}
				renderContent={renderContent}
				duration={200}
				onChange={(section: number[]) => {
					setActiveSections(section)
				}}
				renderAsFlatList={false}
			/>
		</View>
	)
}

const cardStyles = (theme: typeof appTheme) =>
	StyleSheet.create({
		listWrapper: {
			borderRadius: 20,
			overflow: 'hidden',
			marginHorizontal: 15,
			marginVertical: 10
		},
		listItemWrapper: { borderTopColor: theme.color.bg_variant2 },
		listItemContainer: {
			backgroundColor: theme.color.bg_variant,
			alignItems: 'center',
			flexDirection: 'row',
			paddingHorizontal: 20,
			paddingVertical: 10,
		},
		preview: {
			width: 44,
			aspectRatio: 1,
			backgroundColor: theme.color.bg_variant2,
			borderRadius: 10,
			marginRight: 20,
		},
		titleContainer: { flex: 1 },
		issuerTextStyle: { fontSize: 17 },
		labelTextStyle: { marginTop: 3 },
		otpText: {
			color: theme.color.text_color_primary,
			fontSize: 30,
			marginLeft: 64,
		},

		iconArrow: { width: 20, height: 20, color: theme.color.text_color_secondary },
		iconEdit: { width: 24, height: 24, color: theme.color.text_color_secondary },
		iconDelete: {
			marginStart: 20,
			width: 27,
			height: 27,
			color: theme.color.danger_color,
		},
	})
