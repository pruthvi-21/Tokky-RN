import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { RootStackParamList } from '../../../App'
import useTheme from '../../Theming'
import RootView from '../../components/RootView'
import { ThemedButton } from '../../components/ThemedComponents'
import { Text, View } from 'react-native'
import { SFSymbol } from 'react-native-sfsymbols'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ImportAccountsScreen'>
}

function ImportAccountsScreen({ navigation }: Props) {
    const theme = useTheme()

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <ThemedButton
                    title="Cancel"
                    onPress={() => {
                        navigation.goBack()
                    }}
                />
            ),
        })
    }, [])

    return (
        <RootView style={{ backgroundColor: theme.color.modal.bg, paddingHorizontal: 25 }}>
            <View style={{ backgroundColor: '#C49C00', borderRadius: 20, padding: 15, marginTop: 20 }}>
                <View
                    style={{
                        backgroundColor: '#111111',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingVertical: 9,
                        borderRadius: 10,
                    }}>
                    <SFSymbol
                        name="exclamationmark.triangle.fill"
                        weight="semibold"
                        scale="large"
                        color={'#F6B217'}
                        size={20}
                        style={{ width: 24, height: 24 }}
                    />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginHorizontal: 15 }}>WIP</Text>
                </View>
                <Text style={{ marginHorizontal: 20, marginTop: 10 }}>Still not implemented as icloud can't be connected in simulator</Text>
            </View>
        </RootView>
    )
}

export default ImportAccountsScreen
