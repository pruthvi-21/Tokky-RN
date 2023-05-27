import React, { ReactNode, useState } from 'react'
import { ScrollView, StyleSheet, Switch, SwitchProps, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native'
import useTheme, { appTheme } from '../Theming'
import { IconButton, ThemedText } from './ThemedComponents'

type PreferenceScreenProps = {
    children?: ReactNode | undefined
}

type PreferenceCategoryProps = {
    title?: string
    children?: ReactNode | undefined
}

interface PreferenceProps extends TouchableOpacityProps {
    title: string
    summary?: string
    displayArrowAtEnd?: boolean
}

interface SwitchPreferenceProps extends SwitchProps {
    title: string
    summary?: string
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
                        <View style={{ backgroundColor: theme.color.bg_variant }}>
                            {idx !== 0 && <PreferenceDivider />}
                            {item}
                            {idx + 1 !== React.Children.count(props.children) && <PreferenceDivider />}
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

export function PreferenceDivider() {
    const theme = useTheme()
    const styles = preferenceStyles(theme)

    return <View style={styles.preferenceDivider} />
}

export function Preference(props: PreferenceProps) {
    const { title, summary, ...viewProps } = props
    const theme = useTheme()
    const styles = preferenceStyles(theme)

    return (
        <TouchableOpacity style={[styles.preferenceStyle, viewProps.disabled && styles.disabled]} {...viewProps}>
            <ThemedText style={[styles.preferenceTitleStyle]}>{title}</ThemedText>
            {summary && <ThemedText style={{ color: theme.color.text_color_secondary }}>{summary}</ThemedText>}
            {props.displayArrowAtEnd == true && (
                <IconButton icon="chevron-right" style={{ width: 20, height: 20, color: theme.color.text_color_secondary }} />
            )}
        </TouchableOpacity>
    )
}

export function SwitchPreference(props: SwitchPreferenceProps) {
    const { title, summary, ...switchProps } = props
    const theme = useTheme()
    const styles = preferenceStyles(theme)

    const [isEnabled, setIsEnabled] = useState(false)

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
    }

    return (
        <TouchableOpacity style={[styles.preferenceStyle, props.disabled && styles.disabled]} activeOpacity={1} disabled={props.disabled}>
            <View>
                <ThemedText style={styles.preferenceTitleStyle}>{title}</ThemedText>
                {summary && <ThemedText style={{ color: theme.color.text_color_secondary }}>{summary}</ThemedText>}
            </View>
            <Switch onValueChange={toggleSwitch} value={isEnabled} {...switchProps} />
        </TouchableOpacity>
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
        },
        preferenceStyle: {
            backgroundColor: theme.color.bg_variant,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 18,
            minHeight: 49,
        },
        preferenceTitleStyle: {
            fontSize: 17,
            color: theme.color.text_color_primary,
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
