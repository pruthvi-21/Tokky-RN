import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import useTheme from '../Theming'
import Accordion from 'react-native-collapsible/Accordion'
import * as Animatable from 'react-native-animatable'
import TokenModel from '../models/TokenModel'
import { ThemedText, IconButton } from './ThemedComponents'

type Props = {
	inEditMode: boolean
	content: TokenModel[]
	editTokenCallback: (id: string) => void
	deleteTokenCallback: (id: string) => void
}

export default function TokensContainer({
	inEditMode,
	content,
	editTokenCallback,
	deleteTokenCallback,
}: Props) {
	const { theme, styles } = useTheme()
	const [activeSections, setActiveSections] = useState<number[]>([])

	useEffect(() => {
		setActiveSections([])
	}, [inEditMode])

	const renderHeader = (
		content: TokenModel,
		index: number,
		isActive: boolean
	) => {
		return (
			<View
				style={[
					cardStyles.container,
					{
						backgroundColor: theme.bg_variant,
						borderTopWidth: index != 0 ? 1 : 0,
						borderTopColor: theme.divider_color,
					},
				]}
			>
				<View
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row',
					}}
				>
					<View style={cardStyles.preview} />
					<View style={{ flex: 1 }}>
						<ThemedText style={cardStyles.title}>
							{content.issuer}
						</ThemedText>
						<ThemedText type="secondary" style={cardStyles.summary}>
							{content.label}
						</ThemedText>
					</View>
					{!inEditMode && (
						<View
							style={{
								transform: isActive ? 'rotateZ(180deg)' : '',
							}}
						>
							<IconButton
								icon="down-arrow"
								width={20}
								height={20}
								tint={theme.text_color_secondary}
							/>
						</View>
					)}
					{inEditMode && (
						<IconButton
							icon="edit"
							height={24}
							width={24}
							tint={theme.text_color_secondary}
							onPress={() => editTokenCallback(content[index].id)}
						/>
					)}
					{inEditMode && (
						<IconButton
							icon="delete"
							width={27}
							height={27}
							tint={theme.danger_color}
							style={{ marginStart: 20 }}
							onPress={() =>
								deleteTokenCallback(content[index].id)
							}
						/>
					)}
				</View>
			</View>
		)
	}

	const renderContent = (
		content: TokenModel,
		index: number,
		isActive: boolean
	) => {
		return (
			<View style={[cardStyles.container, styles.bgVariant]}>
				<Animatable.Text
					style={[
						styles.textPrimary,
						{ fontSize: 30, marginLeft: 64 },
					]}
					animation={isActive ? 'fadeIn' : undefined}
					duration={500}
				>
					{'123 456'}
				</Animatable.Text>
			</View>
		)
	}

	return (
		<View style={[cardStyles.listWrapper]}>
			<Accordion
				activeSections={activeSections}
				sections={content!}
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

const cardStyles = StyleSheet.create({
	preview: {
		width: 44,
		aspectRatio: 1,
		backgroundColor: '#333333',
		borderRadius: 10,
		marginRight: 20,
	},
	container: {
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	listWrapper: {
		borderRadius: 20,
		overflow: 'hidden',
		marginHorizontal: 15,
	},
	title: {
		fontSize: 17,
	},
	summary: {
		marginTop: 3,
	},
})
