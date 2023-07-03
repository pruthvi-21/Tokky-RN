import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { SectionList, StyleSheet, View } from 'react-native'
import useTheme, { appTheme } from '../../../Theming'
import { ThemedText } from '../../../components/ThemedComponents'
import Account from '../../../models/Account'
import { UserSettings } from '../../../utils/UserSettings'
import HomeListItem from './AccountItem'

type Props = {
    list: Account[]
    editAccountCallback?: (id: string) => void
    deleteAccountCallback?: (id: string) => void
}

function getGroupedAccounts(list: Account[], useGroups: boolean) {
    const categorizedData: { [key: string]: Account[] } = {}

    list.forEach(item => {
        const key = useGroups ? item.issuer.charAt(0).toUpperCase() : 'All Accounts'

        if (!categorizedData[key]) {
            categorizedData[key] = []
        }

        categorizedData[key].push(item)
    })

    const sections = Object.keys(categorizedData).map(key => ({
        key,
        title: key,
        data: categorizedData[key],
    }))

    return sections
}

function AccountsContainer({ list, ...props }: Props) {
    const useGroups = UserSettings.getMenuUseGroup()

    const theme = useTheme()
    const styles = cardStyles(theme)
    const [activeAccountIds, setActiveAccountIds] = useState<string[]>([])
    const [currentTime, setCurrentTime] = useState(Date.now())

    const [groupedList, setGroupedList] = useState(getGroupedAccounts(list, useGroups))

    useFocusEffect(
        useCallback(() => {
            setActiveAccountIds([])
            return () => {
                setActiveAccountIds([])
            }
        }, []),
    )

    useEffect(() => {
        setGroupedList(getGroupedAccounts(list, useGroups))
    }, [useGroups, list])

    useEffect(() => {
        const id = setInterval(() => {
            setCurrentTime(Date.now())
        }, 1000)

        return () => {
            clearInterval(id)
        }
    }, [setCurrentTime])

    function renderSectionHeader({ section }: { section: { title: string } }) {
        return <ThemedText style={styles.header}>{section.title}</ThemedText>
    }

    const renderSectionFooter = ({ section }: { section: { title: string } }) => {
        const isLastSection = groupedList[groupedList.length - 1].title === section.title

        if (isLastSection) {
            return <View style={{ marginBottom: 100 }} />
        }

        return null
    }

    function renderItem({ item, index, section }: { item: Account; index: number; section: any }) {
        const isActive = activeAccountIds.includes(item.id)

        const isFirstItem = index === 0
        const isLastItem = index === section.data.length - 1

        const itemStyles = [styles.itemStyle, isFirstItem && styles.itemStyleTopRounded, isLastItem && styles.itemStyleBottomRounded]

        return (
            <View style={itemStyles}>
                <HomeListItem
                    account={item}
                    isActive={isActive}
                    currentTime={currentTime}
                    onExpand={(accountId: string) => {
                        if (activeAccountIds.includes(accountId)) {
                            setActiveAccountIds(activeAccountIds.filter(it => it !== item.id))
                        } else {
                            setActiveAccountIds([...activeAccountIds, item.id])
                        }
                    }}
                    editAccountCallback={props.editAccountCallback}
                    deleteAccountCallback={props.deleteAccountCallback}
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

    function renderListEmptyComponent() {
        return (
            <View style={[styles.emptyLayoutContainer]}>
                <ThemedText>No accounts added</ThemedText>
                <ThemedText style={{ marginTop: 5 }}>
                    Add a account by clicking on '
                    <ThemedText color={theme.color.primary_color} style={{ fontSize: 20 }}>
                        +
                    </ThemedText>
                    ' on top
                </ThemedText>
            </View>
        )
    }

    return (
        <View style={[styles.listWrapper]}>
            <SectionList
                sections={groupedList}
                keyExtractor={(item, index) => item.issuer + index}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                renderSectionFooter={renderSectionFooter}
                ItemSeparatorComponent={renderItemSeperator}
                ListEmptyComponent={renderListEmptyComponent}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const cardStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        listWrapper: {
            flex: 1,
            flexDirection: 'row',
            position: 'relative',
        },
        listDividerContainer: { backgroundColor: theme.color.bg_variant, marginHorizontal: 15 },
        listDivider: { height: 1, backgroundColor: theme.color.divider_color, marginHorizontal: 20 },
        header: {
            color: theme.color.text_color_secondary,
            paddingHorizontal: 45,
            paddingVertical: 7,
            backgroundColor: theme.color.bg,
            fontWeight: 'bold',
        },
        emptyLayoutContainer: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        itemStyle: {
            backgroundColor: theme.color.bg_variant,
            marginHorizontal: 18,
        },
        itemStyleTopRounded: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        },
        itemStyleBottomRounded: {
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
        },
    })

export default AccountsContainer
