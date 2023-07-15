import { ReactNode, useEffect, useState } from 'react'
import { Animated, Button, Easing, StyleSheet, View, Modal } from 'react-native'
import useTheme, { appTheme } from '../Theming'
import { ThemedButton } from './ThemedComponents'

type Props = {
    children?: ReactNode | undefined
    isVisible: boolean
    onDismiss: () => void
}

function FullScreenModal({ onDismiss, ...props }: Props) {
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
        <Modal visible={isVisible} presentationStyle="pageSheet" animationType="slide">
            <View style={styles.modalBackground}>{props.children}</View>
        </Modal>
    )
}

const bsStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        modalBackground: {
            flex: 1,
            backgroundColor: theme.color.modal.bg,
            paddingHorizontal: 15,
        },
    })

export default FullScreenModal
