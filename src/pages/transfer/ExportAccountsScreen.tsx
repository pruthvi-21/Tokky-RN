import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useContext, useEffect, useState } from 'react'
import { FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import RNFS from 'react-native-fs'
import { SFSymbol } from 'react-native-sfsymbols'
import Share from 'react-native-share'
import { RootStackParamList } from '../../../App'
import useTheme, { appTheme } from '../../Theming'
import CheckBox from '../../components/CheckBox'
import FullScreenModal from '../../components/FullScreenModal'
import RootView from '../../components/RootView'
import { ThemedButton, ThemedText } from '../../components/ThemedComponents'
import IconEdit from '../../components/svg/IconEdit'
import { AccountContext } from '../../data/AccountContext'
import Account from '../../models/Account'
import { getExportFileName } from '../../utils/Utils'
import SplitQRCode from './components/SplitQRCode'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ExportAccountsScreen'>
}

type ExportItem = {
    account: Account
    checked: boolean
}

function ExportAccountsScreen({ navigation }: Props) {
    const theme = useTheme()
    const styles = exportStyles(theme)
    const [isSelectionModalVisible, setIsSelectionModalVisible] = useState(false)
    const [isQrModalVisible, setIsQrModalVisible] = useState(false)
    const [qrData, setQrData] = useState('')

    const { accounts } = useContext(AccountContext)

    const exportListRaw: ExportItem[] = accounts.map(item => {
        return { account: item, checked: true }
    })
    const [exportAccountsList, setExportAccountsList] = useState<ExportItem[]>(exportListRaw)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <ThemedButton
                        title="Done"
                        onPress={() => {
                            navigation.goBack()
                        }}
                    />
                )
            },
        })
        StatusBar.setBarStyle('light-content', true)
        return () => {
            StatusBar.setBarStyle('default', true)
        }
    }, [])

    function QRCodeModal() {
        return (
            <FullScreenModal
                isVisible={isQrModalVisible}
                onDismiss={() => {
                    setIsQrModalVisible(false)
                }}>
                <View style={{ height: 50, justifyContent: 'center', marginBottom: 10 }}>
                    <ThemedText style={{ fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>Scan The QR Code</ThemedText>
                </View>
                <SplitQRCode data={qrData} />
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    style={{ marginBottom: 15, backgroundColor: theme.color.primary_color, borderRadius: 11 }}
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Text style={{ textAlign: 'center', paddingVertical: 15, fontSize: 18, color: 'white' }}>Done</Text>
                </TouchableOpacity>
            </FullScreenModal>
        )
    }

    function AccountSelectionModal() {
        const [exportList, setExportList] = useState<ExportItem[]>(exportAccountsList)

        const modalStyles = StyleSheet.create({
            listItemContainer: {
                paddingVertical: 10,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
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

        function renderItem({ item }: { item: ExportItem }) {
            const { account, checked } = item
            return (
                <View style={modalStyles.listItemContainer}>
                    <View style={modalStyles.titleContainer}>
                        <ThemedText style={modalStyles.issuerTextStyle}>{account.issuer}</ThemedText>
                        {account.label.length !== 0 && (
                            <ThemedText style={modalStyles.labelTextStyle} type="secondary">
                                {account.label}
                            </ThemedText>
                        )}
                    </View>
                    <CheckBox
                        size={22}
                        style={{ marginStart: 15 }}
                        value={checked}
                        onValueChange={(value: boolean) => {
                            console.log(exportList.length)
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
                <View style={modalStyles.listDividerContainer}>
                    <View style={modalStyles.listDivider} />
                </View>
            )
        }

        function handleSelectionDone() {
            setIsSelectionModalVisible(false)
            setExportAccountsList(exportList)
        }

        return (
            <FullScreenModal
                isVisible={isSelectionModalVisible}
                onDismiss={() => {
                    setIsSelectionModalVisible(false)
                }}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {
                            // Dummy
                            <View style={{ opacity: 0 }}>
                                <ThemedButton title="Done" disabled={true} />
                            </View>
                        }

                        <ThemedText style={[styles.pageTitle, { flex: 1 }]}>Select Accounts</ThemedText>
                        <ThemedButton
                            title="Done"
                            onPress={handleSelectionDone}
                            disabled={exportList.filter(it => it.checked).length < 1}
                        />
                    </View>
                    <FlatList
                        data={exportList}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={renderItem}
                        ItemSeparatorComponent={renderItemSeperator}
                    />
                    <View style={{ flex: 1 }} />
                </View>
            </FullScreenModal>
        )
    }

    function handleShowQR() {
        let csv = exportAccountsList.filter(it => it.checked).map(it => it.account.getCSV())
        let qrDataStr = csv.join('\n')
        setQrData(qrDataStr)
        setIsQrModalVisible(true)
    }

    async function handleSaveFile() {
        //get accounts info as json and share as file
        let jsonArray = exportAccountsList.filter(it => it.checked).map(it => it.account.getJSON())
        const path = RNFS.DocumentDirectoryPath + '/' + getExportFileName()

        try {
            await RNFS.writeFile(path, JSON.stringify(jsonArray), 'utf8')
            await Share.open({
                url: 'file://' + path,
                type: 'text/plain',
                saveToFiles: true,
            })
        } catch (error) {
            if (error instanceof Error && error.message !== 'CANCELLED') {
                console.error(error)
            }
        }
    }

    function Divider() {
        return <View style={{ height: 1, backgroundColor: theme.color.text_color_secondary, opacity: 0.4 }}></View>
    }

    return (
        <RootView style={styles.container}>
            <AccountSelectionModal />
            <QRCodeModal />

            {/* Main Content */}
            <ScrollView>
                <ThemedText style={styles.subCategory}>Export</ThemedText>
                <View style={styles.itemBg}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                        <SFSymbol name="person" style={{ width: 24, height: 24 }} size={22} color={theme.color.text_color_primary} />
                        <ThemedText style={{ fontSize: 15, marginHorizontal: 20, flex: 1 }}>
                            {exportAccountsList.filter(it => it.checked).length === accounts.length ? 'All Accounts' : 'Selected Accounts'}
                        </ThemedText>
                        <TouchableOpacity onPress={() => setIsSelectionModalVisible(true)}>
                            <IconEdit size={22} color={theme.color.text_color_secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginVertical: 10, marginStart: 44 }}>
                        <Divider />
                    </View>
                    <ThemedText style={{ marginStart: 44 }} color={theme.color.primary_color}>
                        {`${exportAccountsList.filter(it => it.checked).length}`} account
                        {exportAccountsList.filter(it => it.checked).length > 1 && 's'}
                    </ThemedText>
                </View>

                <ThemedText style={[styles.subCategory, { marginTop: 30 }]}>To</ThemedText>

                <View style={styles.itemBg}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }} onPress={handleShowQR}>
                        <SFSymbol name="qrcode" style={{ width: 24, height: 24 }} size={22} color={theme.color.text_color_primary} />
                        <ThemedText style={{ fontSize: 15, marginHorizontal: 20, flex: 1 }}>QR code</ThemedText>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 10, marginStart: 44 }}>
                        <Divider />
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }} onPress={handleSaveFile}>
                        <SFSymbol name="doc" style={{ width: 24, height: 24 }} size={22} color={theme.color.text_color_primary} />
                        <ThemedText style={{ fontSize: 15, marginHorizontal: 20, flex: 1 }}>File</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </RootView>
    )
}

const exportStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.modal.bg,
            paddingHorizontal: 15,
        },
        subCategory: {
            fontSize: 20,
            color: theme.color.primary_color,
            marginVertical: 15,
        },
        itemBg: {
            backgroundColor: theme.color.modal.bg_variant,
            borderRadius: 15,
            paddingVertical: 10,
            paddingHorizontal: 16,
        },
        modalHeader: {
            height: 48,
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        pageTitle: {
            paddingHorizontal: 20,
            fontSize: 17,
            textAlign: 'center',
            fontWeight: 'bold',
            marginVertical: 20,
        },
    })

export default ExportAccountsScreen
