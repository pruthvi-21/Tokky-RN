import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StyleSheet, Text, View } from 'react-native'
import { SFSymbol } from 'react-native-sfsymbols'
import useTheme, { appTheme } from '../../../Theming'
import RootView from '../../../components/RootView'
import { ThemedButton, ThemedText } from '../../../components/ThemedComponents'
import { ExportStackParamList } from './ExportAccountsScreen'

type Props = {
    navigation: NativeStackNavigationProp<ExportStackParamList, 'ExportTypeScreen'>
    route: RouteProp<ExportStackParamList, 'ExportTypeScreen'>
}

function ExportTypeScreen({ navigation, route }: Props) {
    const theme = useTheme()
    const styles = exportStyles(theme)

    const checkedIds: string[] = route.params.ids

    return (
        <RootView style={styles.container}>
            <ThemedText style={styles.pageTitle}>
                {checkedIds.length} account{checkedIds.length > 1 && 's'} selected
            </ThemedText>

            <View style={{ backgroundColor: '#C49C00', borderRadius: 20, padding: 15 }}>
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
                <Text style={{ marginHorizontal: 20, marginTop: 10 }}>
                    Still not implemented as icloud uploads can't be tested in simulator
                </Text>
            </View>

            <View style={{ flex: 1, marginBottom: 35, justifyContent: 'flex-end' }}>
                <ThemedButton title="Export" filled={true} />
            </View>
        </RootView>
    )
}

const exportStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.modal.bg,
            paddingHorizontal: 15,
        },
        pageTitle: {
            paddingHorizontal: 35,
            fontSize: 17,
            textAlign: 'center',
            marginVertical: 20,
        },
    })

export default ExportTypeScreen
