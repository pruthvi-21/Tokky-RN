import { Text, TouchableOpacity, View } from "react-native"
import { useState } from "react"
import useTheme from "../Theming"
import Accordion from "react-native-collapsible/Accordion"
import * as Animatable from "react-native-animatable"
import { Path, Svg } from "react-native-svg"

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

export default function TokenCard() {
	const { theme, styles } = useTheme()
	const [activeSections, setActiveSections] = useState<number[]>([])

	type SampleType = {
		title: string
		summary: string
	}
	const content: SampleType[] = [
		{ title: "Amazon", summary: "pruthvi-21" },
		{ title: "Google", summary: "pruthvi.21@gmail.com" },
		{ title: "Instagram", summary: "pruthvi.21" },
	]

	const Arrow = () => {
		return (
			<Svg height={20} width={20} viewBox="0 0 24 24">
				<Path
					fill={theme.text_color_secondary}
					d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
				/>
			</Svg>
		)
	}

	const renderHeader = (
		content: SampleType,
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
							{content.title}
						</Text>
						<Text
							style={[styles.textSecondary, cardStyles.summary]}
						>
							{content.summary}
						</Text>
					</View>
					<View
						style={{ transform: isActive ? "rotateZ(180deg)" : "" }}
					>
						<Arrow />
					</View>
				</View>
			</View>
		)
	}

	const renderContent = (
		content: SampleType,
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
				sections={content}
				touchableComponent={TouchableOpacity}
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
