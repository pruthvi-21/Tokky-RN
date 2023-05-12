import { useState } from 'react'
import { Appearance, useColorScheme } from 'react-native'

export const appTheme = {
    dimen: { cornerRadius: 20 },
    color: {
        primary_color: '#228811',
        bg: '#f2f2f4',
        bg_variant: '#ffffff',
        bg_variant2: '#bababa',
        text_color_primary: '#040404',
        text_color_secondary: '#85858A',
        text_color_hint: '#8c8c8c',
        divider_color: '#e7e7e7',
        danger_color: '#ff3d31',
        menu_bg: '#F5F6F5',
        menu_divider: '#DFE0DF',
        modal: {
            bg: '#f2f2f7',
            bg_variant: '#ffffff',
            bg_variant2: '#e1e1e1',
        },
    },
}

export const appThemeDark = {
    ...appTheme,
    color: {
        ...appTheme.color,
        primary_color: '#228811',
        bg: '#010101',
        bg_variant: '#191919',
        bg_variant2: '#333333',
        text_color_primary: '#ffffff',
        text_color_secondary: '#A6a6a6',
        text_color_hint: '#939393',
        divider_color: '#2a2a2c',
        danger_color: '#ff443a',
        menu_bg: '#2A2A2A',
        menu_divider: '#3D3D3E',
        modal: {
            bg: '#1c1c1e',
            bg_variant: '#2c2c2e',
            bg_variant2: '#353536',
        },
    },
}

export default function useTheme() {
    const [currentTheme, setTheme] = useState(useColorScheme())
    Appearance.addChangeListener(obj => {
        setTheme(obj.colorScheme)
    })

    const theme = currentTheme == 'light' ? appTheme : appThemeDark
    return theme
}
