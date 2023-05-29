import { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import useTheme, { appTheme } from '../../Theming'
import BottomSheet from '../../components/BottomSheet'
import { Preference, PreferenceCategory } from '../../components/PreferenceComponents'
import { IconButton, ThemedText } from '../../components/ThemedComponents'
import Timer from '../../components/Timer'
import { TimerIndicatorType } from '../../utils/Constants'
import { UserSettings } from '../../utils/UserSettings'

function UISettings() {
    const theme = useTheme()
    const styles = bsStyles(theme)

    const timerIndicatorValues = [
        //Do not change order
        { type: TimerIndicatorType.NUMBER, name: 'Number' },
        { type: TimerIndicatorType.DISC, name: 'Disc' },
    ]

    const [isVisible, setIsVisible] = useState(false)
    const [activeIndex, setActiveIndex] = useState(UserSettings.getTimerIndicator())

    useEffect(() => {
        UserSettings.setTimerIndicator(activeIndex)
    }, [activeIndex])

    return (
        <PreferenceCategory title="User interface">
            <BottomSheet
                isVisible={isVisible}
                onDismiss={() => {
                    setIsVisible(false)
                }}>
                <View style={styles.indicatorsContainer}>
                    {timerIndicatorValues.map((item, idx) => {
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={styles.itemWrapper}
                                onPress={() => {
                                    setActiveIndex(idx)
                                    setIsVisible(false)
                                }}>
                                <View style={[styles.itemContainer, activeIndex == idx && styles.itemActive]}>
                                    <Timer radius={25} progress={10} maxValue={30} type={item.type} />
                                </View>
                                <ThemedText style={styles.itemTitle}>{item.name}</ThemedText>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </BottomSheet>

            <Preference
                title="Timer indicator"
                value={timerIndicatorValues[activeIndex].name}
                activeOpacity={1}
                widget={<IconButton icon="chevron-up-down" style={{ width: 19, height: 19, color: theme.color.text_color_secondary }} />}
                onPress={() => {
                    setIsVisible(true)
                }}
            />
        </PreferenceCategory>
    )
}

const bsStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        indicatorsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 20,
        },
        itemWrapper: {
            alignItems: 'center',
        },
        itemContainer: {
            padding: 20,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        itemActive: {
            borderColor: theme.color.primary_color,
        },
        itemTitle: {
            marginTop: 10,
            fontSize: 15,
        },
    })

export default UISettings
