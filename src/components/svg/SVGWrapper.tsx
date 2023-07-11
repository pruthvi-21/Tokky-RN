//From https://github.com/reime005/ReactNativeTikTokComments
import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

import useTheme from '../../Theming'

import { ViewStyle } from 'react-native'

interface DefaultSVGWrapperProps {
    width?: number
    height?: number
    scale?: number
    fill?: string
    color?: string
    SVG?: React.ElementType<DefaultSVGWrapperProps>
}

const defaultSVGProps: DefaultSVGWrapperProps = {
    width: 24,
    height: 24,
    scale: 1,
    fill: 'grey',
    color: '#000',
    SVG: undefined,
}

export interface SVGWrapperProps extends DefaultSVGWrapperProps, TransformProps {
    onPress?: () => void
    outerStyle?: ViewStyle
    activeOpacity?: number
}

interface TransformProps {
    rotateByDeg?: number
}

export const transformSVGProps = (props: SVGWrapperProps) => ({
    ...defaultSVGProps,
    ...props,
    width: (props.width || defaultSVGProps.width || 1) * (props.scale || defaultSVGProps.scale || 1),
    height: (props.height || defaultSVGProps.height || 1) * (props.scale || defaultSVGProps.scale || 1),
})

export const SVGWrapper = (props: SVGWrapperProps) => {
    const theme = useTheme()

    const { SVG } = props
    if (!SVG) return null

    const outerStyle = props.outerStyle || {}

    const transformedProps = transformSVGProps(props)

    const outerProps: TouchableOpacityProps = {
        activeOpacity: 1,
        style: {
            ...{
                ...(props.rotateByDeg
                    ? {
                          transform: [
                              {
                                  rotate: `${props.rotateByDeg}deg`,
                              },
                          ],
                          alignItems: 'center',
                          justifyContent: 'center',
                      }
                    : {}),
            },
            ...outerStyle,
        },
        ...props,
    }

    return (
        <TouchableOpacity {...outerProps}>
            <SVG
                {...{
                    fill: theme.color.primary_color,
                    ...transformedProps,
                }}
            />
        </TouchableOpacity>
    )
}
