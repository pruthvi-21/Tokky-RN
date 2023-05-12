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
                    backgroundColor: theme.color.modal.bg_variant,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                }}>
                <ThemedText
                    style={{
                        width: 120,
                        fontSize: 17,
                        fontWeight: '800',
                        paddingStart: 16,
                        paddingEnd: 10,
                    }}>
                    {title}
                </ThemedText>
                <ThemedText style={{ fontSize: 16, textAlign: 'right', paddingEnd: 16 }}>{fieldValue}</ThemedText>
            </View>
        </PickerSelect>
    )
}
