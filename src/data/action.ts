import Account from '../models/Account'
import {
	AccountActionTypes,
	AddAccountAction,
	LoadAccountsAction,
	RemoveAccountAction,
	UpdateAccountAction,
} from './types'

export function loadAccounts(accounts: Account[]): LoadAccountsAction {
	return { type: AccountActionTypes.LOAD_ITEMS, payload: accounts }
}

export function addAccount(account: Account): AddAccountAction {
	return { type: AccountActionTypes.ADD_ITEM, payload: account }
}

export function removeAccount(id: string): RemoveAccountAction {
	return { type: AccountActionTypes.REMOVE_ITEM, payload: id }
}

export function updateAccount(account: Account): UpdateAccountAction {
	return { type: AccountActionTypes.UPDATE_ITEM, payload: account }
}
