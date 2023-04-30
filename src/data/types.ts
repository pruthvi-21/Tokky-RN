import Account from '../models/Account'

export enum AccountActionTypes {
	LOAD_ITEMS = 'LoadItems',
	ADD_ITEM = 'AddItem',
	REMOVE_ITEM = 'RemoveItem',
	UPDATE_ITEM = 'UpdateItem',
}

export interface LoadAccountsAction {
	type: AccountActionTypes.LOAD_ITEMS
	payload: Account[]
}

export interface AddAccountAction {
	type: AccountActionTypes.ADD_ITEM
	payload: Account | undefined
}

export interface RemoveAccountAction {
	type: AccountActionTypes.REMOVE_ITEM
	payload: string
}

export interface UpdateAccountAction {
	type: AccountActionTypes.UPDATE_ITEM
	payload: Account | undefined
}

export type AccountAction = LoadAccountsAction | AddAccountAction | RemoveAccountAction | UpdateAccountAction
