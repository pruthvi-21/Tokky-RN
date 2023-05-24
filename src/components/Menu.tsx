import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from 'react-native'
import useTheme, { appTheme } from '../Theming'
import { IconButton, ThemedText } from './ThemedComponents'

export type MenuItem = {
    title: string
    callback?: () => void
}

type Props = {
    menuItems: MenuItem[]
}

const MENU_WIDTH = 240
const MENU_ITEM_HEIGHT = 45
const OVERFLOW_ICON_SIZE = 22.5

const ANIM_START_DURATION = 300
const ANIM_STOP_DURATION = 250

const Menu = ({ menuItems }: Props) => {
    const theme = useTheme()
    const styles = menuStyles(theme)

    const [isVisible, setIsVisible] = useState(false)
    const [topMargin, setTopMargin] = useState(0)
    const iconRef = useRef<TouchableOpacity>(null)

    const fadeAnim = useState(new Animated.Value(0))[0]

    const toggleMenu = (status: boolean) => {
        if (status) {
            iconRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                let top = pageY + OVERFLOW_ICON_SIZE + 7.5
                setTopMargin(top)
            })
            setIsVisible(true)
        }
        Animated.timing(fadeAnim, {
            toValue: status ? 1 : 0,
            duration: status ? ANIM_START_DURATION : ANIM_STOP_DURATION,
            easing: status ? Easing.elastic(0.9) : undefined,
            useNativeDriver: true,
        }).start(() => {
            !status && setIsVisible(false)
        })
    }

    const handleMenuItemPress = (item: MenuItem) => {
        toggleMenu(false)
        item.callback?.()
    }

    const animatedViewStyle = {
        ...styles.menuListContainer,
        marginTop: topMargin,
        opacity: fadeAnim,
        transform: [
            {
                translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [MENU_WIDTH / 2, 0],
                }),
            },
            {
                translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-(MENU_ITEM_HEIGHT * menuItems.length) / 2, 0],
                }),
            },
            { scaleX: fadeAnim },
            { scaleY: fadeAnim },
        ],
    }

    return (
        <View>
            <TouchableOpacity ref={iconRef} onPress={() => toggleMenu(true)}>
                <IconButton
                    icon="overflow-menu"
                    style={{
                        width: OVERFLOW_ICON_SIZE,
                        height: OVERFLOW_ICON_SIZE,
                        color: theme.color.primary_color,
                    }}
                />
            </TouchableOpacity>
            <Modal visible={isVisible} transparent={true} onRequestClose={() => toggleMenu(false)}>
                <TouchableWithoutFeedback onPressIn={() => toggleMenu(false)}>
                    <View style={styles.modalBackground}>
                        <Animated.View style={[animatedViewStyle]}>
                            {menuItems.map((item, index) => (
                                <View key={index}>
                                    {index != 0 && <View style={styles.divider} />}
                                    <TouchableOpacity onPress={() => handleMenuItemPress(item)}>
                                        <ThemedText style={styles.menuItem}>{item.title}</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

const menuStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        modalBackground: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
        },
        menuListContainer: {
            width: MENU_WIDTH,
            backgroundColor: theme.color.menu_bg,
            marginRight: 10,
            borderRadius: 11,
            shadowRadius: 40,
            shadowOpacity: 0.2,
        },
        menuItem: {
            height: MENU_ITEM_HEIGHT,
            fontSize: 17,
            paddingVertical: 12,
            paddingHorizontal: 16,
            textAlign: 'left',
        },
        divider: {
            backgroundColor: theme.color.menu_divider,
            height: 2,
        },
    })

export default Menu
