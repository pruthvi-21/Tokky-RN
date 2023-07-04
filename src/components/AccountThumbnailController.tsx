import React, { useEffect, useState } from 'react'
import { ColorValue, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'
import { SFSymbol } from 'react-native-sfsymbols'
import useTheme from '../Theming'
import { ICONS, Thumbnail, ThumbnailIconAssetType, ThumbnailIconType } from '../utils/Constants'
import { getThumbnailInitials } from '../utils/Utils'
import BottomSheet from './BottomSheet'
import { ThemedButton, ThemedText } from './ThemedComponents'

const THUMB_RATIO = 220 / 150

const THUMB_SMALL_DIMENS = {
    width: 60,
    height: 60 / THUMB_RATIO,
    radius: 11,
    fontSize: 20,
}

const THUMB_LARGE_DIMENS = {
    width: 100,
    height: 100 / THUMB_RATIO,
    radius: THUMB_SMALL_DIMENS.radius * THUMB_RATIO,
    fontSize: THUMB_SMALL_DIMENS.fontSize * THUMB_RATIO,
}

interface Props extends ViewProps {
    text: string
    thumb?: Thumbnail
    onChange: (text: Thumbnail) => void
}

interface ThumbnailProps {
    size: 'small' | 'large'
    thumb: Thumbnail
    text: string
}

export function ThumbnailPreview(props: ThumbnailProps) {
    const DIMENS = props.size == 'large' ? THUMB_LARGE_DIMENS : THUMB_SMALL_DIMENS

    const styles = StyleSheet.create({
        thumbnailFrame: {
            width: DIMENS.width,
            height: DIMENS.height,
            borderRadius: DIMENS.radius,
            backgroundColor: props.thumb.type == ThumbnailIconType.COLOR ? props.thumb.value! : undefined,
        },
        thumbnail: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        textStyle: {
            color: 'white',
            fontSize: DIMENS.fontSize,
        },
    })
    return (
        <View style={styles.thumbnailFrame}>
            {props.thumb.type == ThumbnailIconType.COLOR && (
                <View style={[styles.thumbnail]}>
                    <Text style={styles.textStyle}>{getThumbnailInitials(props.text)}</Text>
                </View>
            )}
            {props.thumb.type == ThumbnailIconType.ICON && (
                <Image
                    source={ICONS.filter(item => item.id == props.thumb.value)[0]?.src}
                    style={[
                        styles.thumbnailFrame,
                        {
                            opacity: props.thumb.value == null ? 0 : 1,
                            position: 'absolute',

                            // borderWidth: props.size == 'small' ? 1 : 0,
                            // borderColor: theme.color.bg_variant2,
                        },
                    ]}
                />
            )}
        </View>
    )
}

function AccountThumbnailController({ thumb, style, onChange, ...props }: Props) {
    const theme = useTheme()

    const colors = [
        '#A0522D', //Sienna
        '#376B97', //Steel Blue
        '#556B2F', //Dark Olive Green
        '#B18F96', //Dusty Rose
        '#C8AA4B', //Gold
    ]
    const [currentThumbnail, setCurrentThumbnail] = useState<Thumbnail>({
        type: thumb?.type || ThumbnailIconType.COLOR,
        value: thumb?.value || colors[Math.floor(Math.random() * (colors.length - 1))],
    })
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        onChange(currentThumbnail)
    }, [currentThumbnail])

    function ColorTile({ color, onPress }: { color: ColorValue; onPress: () => void }) {
        return (
            <TouchableOpacity
                style={[styles.colorTileContainer, color == currentThumbnail.value && { borderColor: 'green' }]}
                onPress={onPress}>
                <View style={[styles.colorTile, { backgroundColor: color }]} />
            </TouchableOpacity>
        )
    }

    const ThumbnailIconPicker = ({ list }: { list: ThumbnailIconAssetType[] }) => {
        const width = 75
        const height = width / THUMB_RATIO
        const columnCount = 3

        while (list.length % 3 !== 0) {
            list.push({ id: 'dummy', label: '', src: null })
        }

        const renderItem = ({ item }: { item: ThumbnailIconAssetType }) => (
            <TouchableOpacity
                style={{ margin: 10, padding: 10, width: 97, flex: 1 }}
                onPress={() => {
                    if (!item.src) return
                    setIsVisible(false)
                    setCurrentThumbnail({
                        type: ThumbnailIconType.ICON,
                        value: item.id,
                    })
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={item.src}
                        style={[
                            { width: width, height: height, borderRadius: 11, borderWidth: 1, borderColor: theme.color.bg_variant2 },
                            { opacity: item.src == null ? 0 : 1 },
                        ]}
                    />
                    <ThemedText style={{ marginTop: 5, textAlign: 'center' }}>{item.label}</ThemedText>
                </View>
            </TouchableOpacity>
        )

        return (
            <FlatList data={list} renderItem={renderItem} numColumns={columnCount} contentContainerStyle={{ justifyContent: 'center' }} />
        )
    }

    return (
        <View style={[styles.container, style]} {...props}>
            <BottomSheet
                isVisible={isVisible}
                onDismiss={() => {
                    setIsVisible(false)
                }}>
                <View style={{ maxHeight: Dimensions.get('window').height - 150 }}>
                    <View style={{ alignItems: 'flex-end', marginHorizontal: 16 }}>
                        <ThemedButton title="Cancel" onPress={() => setIsVisible(false)} />
                    </View>
                    <ThumbnailIconPicker list={ICONS.sort((a, b) => a.label.localeCompare(b.label))} />
                </View>
            </BottomSheet>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/*Just a dummy to align thumb to center*/}
                <View style={{ width: 24 + 20 }} />
                <View style={{ position: 'relative' }}>
                    <ThumbnailPreview text={props.text} size="large" thumb={currentThumbnail} />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setIsVisible(true)
                    }}
                    style={{ marginStart: 20, width: 24, height: 24, justifyContent: 'center' }}>
                    <SFSymbol size={24} name="photo.on.rectangle" color={theme.color.text_color_secondary} />
                </TouchableOpacity>
            </View>
            <View style={styles.tilesContainer}>
                {colors.map((item, idx) => {
                    return (
                        <ColorTile
                            key={idx}
                            color={item}
                            onPress={() => {
                                setCurrentThumbnail({
                                    type: ThumbnailIconType.COLOR,
                                    value: item,
                                })
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
