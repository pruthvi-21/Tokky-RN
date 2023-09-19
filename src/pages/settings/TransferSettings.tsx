import React, { useEffect, useState } from 'react'
import { Preference, PreferenceCategory } from './components/PreferenceComponents'
import { SFSymbol } from 'react-native-sfsymbols'
import useTheme from '../../Theming'
import AccountsDB from '../../data/AccountsDB'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../App'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SettingsScreen'>
}

const TransferSettings = ({ navigation }: Props) => {
    const theme = useTheme()

    const [disableExport, setDisableExport] = useState(false)

    useEffect(() => {
        AccountsDB.getAll().then((data) => {
            setDisableExport(data.length == 0)
        })
    }, [])

    return (
        <PreferenceCategory title='Transfer Accounts'>
            <Preference
                title='Import Accounts'
                widget={<SFSymbol style={{ marginEnd: 10 }} name='chevron.right' color={theme.color.text_color_secondary} size={16} />}
                onPress={() => navigation.navigate('ImportAccountsScreen')}
            />
            <Preference
                title='Export Accounts'
                widget={<SFSymbol style={{ marginEnd: 10 }} name='chevron.right' color={theme.color.text_color_secondary} size={16} />}
                disabled={disableExport}
                onPress={() => navigation.navigate('ExportAccountsScreen')}
            />
        </PreferenceCategory>
    )
}

export default TransferSettings