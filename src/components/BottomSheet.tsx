import { ReactNode, useEffect, useState } from 'react'
import { Animated, Easing, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import useTheme, { appTheme } from '../Theming'

type Props = {
    children?: ReactNode | undefined
    isVisible: boolean
    onDismiss: () => void
}

function BottomSheet({ onDismiss, ...props }: Props) {
    const theme = useTheme()
    const styles = bsStyles(theme)

    const anim = useState(new Animated.Value(0))[0]
    const [isVisible, setIsVisible] = useState(props.isVisible)

    useEffect(() => {
        changeVisibility(props.isVisible)
    }, [props.isVisible])

    function changeVisibility(visibility: boolean) {
        if (visibility) {
            setIsVisible(true)
        }
        Animated.timing(anim, {
            toValue: visibility ? 1 : 0,
            duration: 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            !visibility && setIsVisible(false)
            !visibility && onDismiss()
        })
    }

    return (
        <Modal visible={isVisible} transparent={true} onRequestClose={() => changeVisibility(false)}>
            <TouchableWithoutFeedback onPressIn={() => changeVisibility(false)}>
                <Animated.View style={[styles.modalBackground, { opacity: anim }]}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.container,
                                {
                                    transform: [
                                        {
                                            translateY: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [100, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}>
                            {props.children}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const bsStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        modalBackground: {
            flex: 1,
            backgroundColor: '#0008',
            justifyContent: 'flex-end',
        },
        container: {
            backgroundColor: theme.color.bg_variant,
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
        },
    })

export default BottomSheet
