import React, { useEffect, useState } from 'react'
import { ColorValue, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'
import { getThumbnailInitials } from '../utils/Utils'

interface Props extends ViewProps {
    text: string
    color?: ColorValue
    onChange: (text: ColorValue) => void
}

interface ThumbnailProps {
    size: number
    cornerRadius?: number
    color: ColorValue
    text: string
}

export function Thumbnail(props: ThumbnailProps) {
    const styles = StyleSheet.create({
        thumbnail: {
            width: props.size,
            backgroundColor: props.color,
            borderRadius: props.cornerRadius,
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        textStyle: {
            color: 'white',
            fontSize: 0.4 * props.size,
        },
    })
    return (
        <View style={[styles.thumbnail]}>
            <Text style={styles.textStyle}>{getThumbnailInitials(props.text)}</Text>
        </View>
    )
}

function AccountThumbnailController({ color, style, onChange, ...props }: Props) {
    const colors = [
        '#A0522D', //Sienna
        '#376B97', //Steel Blue
        '#556B2F', //Dark Olive Green
        '#B18F96', //Dusty Rose
        '#C8AA4B', //Gold
    ]
    const [selectedColor, setSelectedColor] = useState<ColorValue>(color || colors[Math.floor(Math.random() * (colors.length - 1))])

    useEffect(() => {
        onChange(selectedColor)
    }, [selectedColor])

    function ColorTile({ color, onPress }: { color: ColorValue; onPress: () => void }) {
        return (
            <TouchableOpacity style={[styles.colorTileContainer, color == selectedColor && { borderColor: 'green' }]} onPress={onPress}>
                <View style={[styles.colorTile, { backgroundColor: color }]} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={[styles.container, style]} {...props}>
            <Thumbnail color={selectedColor} text={props.text} size={100} cornerRadius={25} />
            <View style={styles.tilesContainer}>
                {colors.map((item, idx) => {
                    return (
                        <ColorTile
                            key={idx}
                            color={item}
                            onPress={() => {
                                setSelectedColor(item)
                            }}
                        />
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    tilesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    colorTileContainer: {
        margin: 8,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: 'transparent',
    },
    colorTile: {
        width: 34,
        aspectRatio: 1,
        margin: 2,
        borderRadius: 20,
    },
})

export default AccountThumbnailController
