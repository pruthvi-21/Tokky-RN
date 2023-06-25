import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import useTheme, { appTheme } from '../../../Theming'
import CheckBox from '../../../components/CheckBox'
import RootView from '../../../components/RootView'
import { ThemedButton, ThemedText } from '../../../components/ThemedComponents'
import { AccountContext } from '../../../data/AccountContext'
import Account from '../../../models/Account'
import { ExportStackParamList } from './ExportAccountsScreen'

type Props = {
    navigation: NativeStackNavigationProp<ExportStackParamList, 'ExportAccountSelection'>
}

type ExportItem = {
    account: Account
    checked: boolean
}

function ExportAccountSelection({ navigation }: Props) {
    const theme = useTheme()
    const styles = exportStyles(theme)

    const accountContext = useContext(AccountContext)

    const exportListRaw: ExportItem[] = accountContext.accounts.map(item => {
        return { account: item, checked: true }
    })

    const [exportList, setExportList] = useState<ExportItem[]>(exportListRaw)

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

    useEffect(() => {
        const checkedList = exportList.filter(item => item.checked).map(item => item.account.id)

        navigation.setOptions({
            headerRight: () => (
                <View style={{ opacity: checkedList.length <= 0 ? 0.3 : 1 }}>
                    <ThemedButton
                        title="Next"
                        disabled={checkedList.length <= 0}
                        onPress={() => {
                            navigation.navigate('ExportTypeScreen', { ids: checkedList })
                        }}
                    />
                </View>
            ),
        })
    }, [exportList])

    function renderItem({ item }: { item: ExportItem }) {
        const { account, checked } = item
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <ThemedText style={styles.issuerTextStyle}>{account.issuer}</ThemedText>
                    {account.label.length !== 0 && (
                        <ThemedText style={styles.labelTextStyle} type="secondary">
                            {account.label}
                        </ThemedText>
                    )}
                </View>
                <CheckBox
                    size={22}
                    style={{ marginStart: 15 }}
                    value={checked}
                    onValueChange={(value: boolean) => {
                        setExportList(prevData =>
                            prevData.map(item => (item.account.id === account.id ? { ...item, checked: value } : item)),
                        )
                    }}
                />
            </View>
        )
    }

    function renderItemSeperator() {
        return (
            <View style={styles.listDividerContainer}>
                <View style={styles.listDivider} />
            </View>
        )
    }

    return (
        <RootView style={{ backgroundColor: theme.color.modal.bg }}>
            <ThemedText style={styles.pageTitle}>Select all the accounts you want to export</ThemedText>
            <FlatList
                data={exportList}
                keyExtractor={item => item.account?.issuer}
                renderItem={renderItem}
                ItemSeparatorComponent={renderItemSeperator}
            />
        </RootView>
    )
}

const exportStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        container: {
            paddingVertical: 10,
            paddingHorizontal: 35,
            minHeight: 60,
            flexDirection: 'row',
            alignItems: 'center',
        },
        pageTitle: {
            paddingHorizontal: 35,
            fontSize: 17,
            textAlign: 'center',
            marginVertical: 20,
        },
        titleContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        issuerTextStyle: {
            fontSize: 17,
        },
        labelTextStyle: {
            marginTop: 3,
        },
        listDividerContainer: { backgroundColor: 'transparent', marginHorizontal: 15 },
        listDivider: { height: 1, backgroundColor: theme.color.modal.bg_variant2, marginHorizontal: 20 },
    })

export default ExportAccountSelection
