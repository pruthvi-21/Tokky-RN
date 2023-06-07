import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { ColorValue } from 'react-native/types'
import Account from '../models/Account'
import DB from './AccountsDB'

interface AccountContextType {
    accounts: Account[]
    loadAccounts: (accounts: Account[]) => void
    addAccount: (account: Account) => Promise<void>
    removeAccount: (id: string) => Promise<void>
    updateAccount: (account: Account, data: { issuer: string; label: string; thumbnailColor: ColorValue }) => Promise<void>
}

const defaultState = {
    accounts: [],
    loadAccounts: () => {},
    addAccount: async () => {},
    removeAccount: async () => {},
    updateAccount: async () => {},
} as AccountContextType

export const AccountContext = createContext(defaultState)

export const AccountProvider = ({ children }: { children: ReactNode | undefined }) => {
    const [accounts, setAccounts] = useState<Account[]>([])

    const loadAccounts = (accounts: Account[]) => {
        setAccounts(accounts.sort((a, b) => a.name.localeCompare(b.name)))
    }

    const addAccount = async (account: Account) => {
        const rowId = await DB.insert(account)
        if (typeof rowId === 'number' && rowId > 0) setAccounts([...accounts, account].sort((a, b) => a.name.localeCompare(b.name)))
    }

    const removeAccount = async (id: string) => {
        const rowsEffected = await DB.remove(id)
        rowsEffected > 0 && setAccounts(accounts.filter(item => item.id !== id))
    }

    const updateAccount = async (account: Account, data: { issuer: string; label: string; thumbnailColor: ColorValue }) => {
        await DB.update(account.id, data.issuer, data.label, data.thumbnailColor)
        account.issuer = data.issuer
        account.label = data.label
        account.thumbnailColor = data.thumbnailColor
        setAccounts([...accounts].sort((a, b) => a.name.localeCompare(b.name)))
    }

    return (
        <AccountContext.Provider
            value={{
                accounts,
                loadAccounts,
                addAccount,
                removeAccount,
                updateAccount,
            }}>
            {children}
        </AccountContext.Provider>
    )
}
