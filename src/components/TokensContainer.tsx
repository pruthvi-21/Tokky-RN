import { Alert, Animated, Text, TouchableOpacity, View } from "react-native"
import { useEffect, useRef, useState } from "react"
import useTheme from "../Theming"
import Accordion from "react-native-collapsible/Accordion"
import * as Animatable from "react-native-animatable"
import { Path, Svg } from "react-native-svg"
import { TokenRepo } from "../database/TokenRepo"
import TokenModel from "../models/TokenModel"

const cardStyles = {
	preview: {
		width: 44,
		aspectRatio: 1,
		backgroundColor: "#333333",
		borderRadius: 10,
		marginRight: 20,
	},
	container: {
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	collapsedContainer: {
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 17,
	},
	summary: {
		marginTop: 3,
	},
}

type Props = {
	inEditMode: boolean
}

export default function TokensContainer({ inEditMode }: Props) {
	const repo = TokenRepo.getInstance()
	const { theme, styles } = useTheme()
	const [activeSections, setActiveSections] = useState<number[]>([])
	const [content, setContent] = useState(repo.tokensList)

	useEffect(() => {
		setActiveSections([])
	}, [inEditMode])

	const IconArrow = () => {
		return (
			<Svg height={20} width={20} viewBox="0 0 24 24">
				<Path
					fill={theme.text_color_secondary}
					d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
				/>
			</Svg>
		)
	}

	const IconEdit = () => {
		return (
			<TouchableOpacity activeOpacity={0.5}>
				<Svg height={24} width={24} viewBox="0 0 24 24">
					<Path
						d="M17.665,10.455L20.755,7.365L16.635,3.245L13.545,6.335M17.665,10.455L7.365,20.755L3.245,20.755L3.245,16.635L13.545,6.335M17.665,10.455L13.545,6.335"
						stroke={theme.text_color_secondary}
						strokeWidth={1.5}
					/>
				</Svg>
			</TouchableOpacity>
		)
	}

	const IconDelete = ({ index }: { index: number }) => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{ marginStart: 20 }}
				onPress={() => handleDeleteItem(index)}
			>
				<Svg height={27} width={27} viewBox="0 0 24 24">
					<Path
						d="M13.94,11.03L13.94,16.85,M10.06,11.03L10.06,16.85,M4.24,7.15L19.76,7.15,M6.18,7.15L12,7.15L17.82,7.15L17.82,17.82C17.82,19.427 16.517,20.73 14.91,20.73L9.09,20.73C7.483,20.73 6.18,19.427 6.18,17.82L6.18,7.15Z"
						stroke={theme.danger_color}
						strokeWidth={1.5}
					/>
					<Path
						d="M9.09,5.21C9.09,4.139 9.959,3.27 11.03,3.27L12.97,3.27C14.041,3.27 14.91,4.139 14.91,5.21L14.91,7.15L9.09,7.15L9.09,5.21Z"
						stroke={theme.danger_color}
						strokeWidth={1.5}
					/>
				</Svg>
			</TouchableOpacity>
		)
	}

	const handleDeleteItem = (index: number) => {
		Alert.alert(
			"Warning",
			"Before removing please ensure that you turn off 2FA for this account.\n\n This operation cannot be undone.",
			[
				{ text: "Cancel", style: "cancel", onPress: () => {} },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						repo.remove(content[index])
						setContent(repo.tokensList)
					},
				},
			]
		)
	}

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
						display: "flex",
						alignItems: "center",
						flexDirection: "row",
					}}
				>
					<View style={cardStyles.preview} />
					<View style={{ flex: 1 }}>
						<Text style={[styles.textPrimary, cardStyles.title]}>
							{content.issuer}
						</Text>
						<Text
							style={[styles.textSecondary, cardStyles.summary]}
						>
							{content.label}
						</Text>
					</View>
					{!inEditMode && (
						<View
							style={{
								transform: isActive ? "rotateZ(180deg)" : "",
							}}
						>
							<IconArrow />
						</View>
					)}
					{inEditMode && <IconEdit />}
					{inEditMode && <IconDelete index={index} />}
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
			<Animatable.View
				style={[cardStyles.collapsedContainer, styles.bgVariant]}
				duration={150}
				transition="backgroundColor"
			>
				<Animatable.Text
					style={[
						styles.textPrimary,
						{ fontSize: 30, marginLeft: 64 },
					]}
					animation={isActive ? "fadeIn" : undefined}
					duration={500}
				>
					{"123 456"}
				</Animatable.Text>
			</Animatable.View>
		)
	}

	return (
		<View
			style={{
				borderRadius: 20,
				overflow: "hidden",
				marginHorizontal: 15,
			}}
		>
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
