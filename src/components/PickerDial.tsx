import React from 'react'
import PickerSelect, { PickerSelectProps } from 'react-native-picker-select'
import useTheme from '../Theming'
import { View } from 'react-native'
import { ThemedText } from './ThemedComponents'

interface Props extends PickerSelectProps {
    title: string
    fieldValue: string
}

export default function PickerDial({ title, fieldValue, ...props }: Props) {
    const theme = useTheme()

    return (
        <PickerSelect
            style={{
                chevronActive: { borderColor: theme.color.primary_color },
                modalViewMiddle: { backgroundColor: theme.color.modal.bg_variant2, borderTopColor: theme.color.divider_color },
                modalViewBottom: { backgroundColor: theme.color.modal.bg_variant },
                done: { color: theme.color.primary_color, fontSize: 17 },
                doneDepressed: { fontSize: 17 },
            }}
            pickerProps={{ itemStyle: { fontSize: 19, color: theme.color.text_color_primary } }}
            placeholder={{}}
            {...props}>
            <View
                style={{
                    padding: 11,
                    backgroundColor: theme.color.modal.bg_variant,
                    borderColor: theme.color.modal.bg_variant2,
                    borderWidth: 2,
                    borderRadius: 11,
                    flexDirection: 'row',
                }}>
                <ThemedText
                    style={{
                        width: 120,
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}>
                    {title}
                </ThemedText>
                <ThemedText style={{ fontSize: 16 }}>{fieldValue}</ThemedText>
            </View>
        </PickerSelect>
    )
}
