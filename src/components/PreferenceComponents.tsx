import React, { ReactNode, useState } from 'react'
import { ScrollView, StyleSheet, Switch, SwitchProps, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native'
import useTheme, { appTheme } from '../Theming'
import { ThemedText } from './ThemedComponents'

type PreferenceScreenProps = {
    children?: ReactNode | undefined
}

type PreferenceCategoryProps = {
    title?: string
    footer?: string
    children?: ReactNode | undefined
}

interface PreferenceProps extends TouchableOpacityProps {
    title: string
    value?: string
    widget?: ReactNode
}

interface SwitchPreferenceProps extends SwitchProps {
    title: string
}

export function PreferenceScreen(props: PreferenceScreenProps) {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
            {props.children}
        </ScrollView>
    )
}

export function PreferenceCategory(props: PreferenceCategoryProps) {
    const theme = useTheme()
    const styles = preferenceStyles(theme)

    return (
        <View style={styles.preferenceCategoryStyle}>
            {props.title && <ThemedText style={styles.preferenceCategoryTitleStyle}>{props.title.toUpperCase()}</ThemedText>}
            <View style={styles.preferenceCategoryChildrenContainer}>
                {React.Children.map(props.children, (item, idx) => {
                    return (
                        <View>
                            {idx !== 0 && <PreferenceDivider />}
                            {item}
                            {idx + 1 !== React.Children.count(props.children) && <PreferenceDivider />}
                        </View>
                    )
                })}
            </View>
            {props.footer && <ThemedText style={styles.preferenceCategoryFooter}>{props.footer}</ThemedText>}
        </View>
    )
}

export function PreferenceDivider() {
    const theme = useTheme()
    const styles = preferenceStyles(theme)

    return <View style={styles.preferenceDivider} />
}

export function Preference(props: PreferenceProps) {
    const { title, value, widget, ...viewProps } = props
    const theme = useTheme()
    const styles = preferenceStyles(theme)

    return (
        <TouchableOpacity style={[styles.preferenceStyle, viewProps.disabled && styles.disabled]} {...viewProps}>
            <ThemedText style={[styles.preferenceTitleStyle]}>{title}</ThemedText>
            <ThemedText style={styles.preferenceValueStyle}>{value}</ThemedText>
            <View>{widget}</View>
        </TouchableOpacity>
    )
}

export function SwitchPreference(props: SwitchPreferenceProps) {
    const { title, ...switchProps } = props
    const [isEnabled, setIsEnabled] = useState(false)

    return (
        <Preference
            widget={<Switch onValueChange={() => setIsEnabled(previousState => !previousState)} value={isEnabled} {...switchProps} />}
            {...props}
            activeOpacity={1}
        />
    )
}

const preferenceStyles = (theme: typeof appTheme) => {
    return StyleSheet.create({
        preferenceCategoryStyle: {
            marginTop: 15,
            marginBottom: 25,
        },
        preferenceCategoryTitleStyle: {
            paddingHorizontal: 15,
            paddingVertical: 5,
            color: theme.color.preferences.category_title,
            fontWeight: '500',
            marginBottom: 5,
        },
        preferenceCategoryChildrenContainer: {
            borderRadius: 11,
            overflow: 'hidden',
            backgroundColor: theme.color.bg_variant,
        },
        preferenceCategoryFooter: {
            color: theme.color.text_color_secondary,
            marginTop: 5,
            paddingHorizontal: 18,
        },
        preferenceStyle: {
            backgroundColor: theme.color.bg_variant,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 18,
            minHeight: 49,
            padding: 9,
        },
        preferenceTitleStyle: {
            fontSize: 17,
            color: theme.color.text_color_primary,
            flex: 1,
        },
        preferenceValueStyle: {
            color: theme.color.text_color_secondary,
            fontSize: 15.5,
            marginEnd: 5,
        },
        disabled: {
            opacity: 0.4,
        },
        preferenceDivider: {
            height: 0.5,
            backgroundColor: theme.color.menu_divider,
            marginHorizontal: 17,
        },
    })
}
