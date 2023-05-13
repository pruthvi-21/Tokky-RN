import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import useTheme, { appTheme } from '../Theming'
import { IconButton, ThemedText } from './ThemedComponents'
import { isAndroid, isIOS } from '../utils/Utils'

export type MenuItem = {
    title: string
    callback?: () => void
}

type Props = {
    menuItems: MenuItem[]
}

const Menu = ({ menuItems }: Props) => {
    const theme = useTheme()
    const styles = menuStyles(theme)

    const [isVisible, setIsVisible] = useState(false)
    const [Y, setY] = useState(0)
    const iconRef = useRef<TouchableOpacity>(null)

    const fadeAnim = useState(new Animated.Value(0))[0]
    const interpolationConfig = {
        //y = sqrt(x)
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, 0.5, 0.7071, 0.866, 1],
    }
    useEffect(() => {}, [isVisible])

    const toggleMenu = (status: boolean) => {
        if (status) {
            iconRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                let top = pageY
                if (isIOS()) top += 22.5 + 5
                setY(top)
            })

            setIsVisible(status)
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }).start(() => {
                setIsVisible(false)
            })
        }
    }

    const handleMenuItemPress = (item: MenuItem) => {
        toggleMenu(false)
        item.callback?.()
    }

    return (
        <View>
            <TouchableOpacity ref={iconRef} onPress={() => toggleMenu(true)}>
                <IconButton
                    icon="overflow-menu"
                    style={{
                        width: 22.5,
                        height: 22.5,
                        color: isIOS() ? theme.color.primary_color : theme.color.text_color_primary,
                    }}
                />
            </TouchableOpacity>
            <Modal visible={isVisible} transparent={true} onRequestClose={() => toggleMenu(false)}>
                <TouchableWithoutFeedback onPressIn={() => toggleMenu(false)}>
                    <View style={styles.modalBackground}>
                        <Animated.View
                            style={{
                                opacity: fadeAnim.interpolate(interpolationConfig),
                                transform: [{ scaleY: fadeAnim.interpolate(interpolationConfig) }],
                            }}>
                            <View style={[styles.modalContainer, { marginTop: Y }]}>
                                {menuItems.map((item, index) => (
                                    <View key={index}>
                                        {index != 0 && <View style={styles.divider} />}
                                        <TouchableOpacity onPress={() => handleMenuItemPress(item)}>
                                            <ThemedText style={styles.menuItem}>{item.title}</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
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
        modalContainer: {
            backgroundColor: theme.color.menu_bg,
            marginRight: 10,
            borderRadius: isAndroid() ? 16 : 8,
            minWidth: isAndroid() ? undefined : 220,
        },
        menuItem: {
            fontSize: isAndroid() ? 15 : 17,
            paddingVertical: 12,
            paddingHorizontal: isAndroid() ? 22 : 16,
            textAlign: 'left',
        },
        divider: {
            backgroundColor: theme.color.menu_divider,
            height: 2,
        },
    })

export default Menu
