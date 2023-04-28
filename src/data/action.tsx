import Account from '../models/Account'
import { AccountActionTypes, AddAccountAction, RemoveAccountAction, UpdateAccountAction } from './types'

export const addAccount = (account: Account): AddAccountAction => ({
	type: AccountActionTypes.ADD_ITEM,
	account,
})
export const removeAccount = (id: string): RemoveAccountAction => ({
	type: AccountActionTypes.REMOVE_ITEM,
	id,
})
export const updateAccount = (id: string, issuer: string, label: string): UpdateAccountAction => ({
	type: AccountActionTypes.UPDATE_ITEM,
	id,
	issuer,
	label,
})
