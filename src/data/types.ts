import Account from "../models/Account"

export enum AccountActionTypes {
	ADD_ITEM = 'AddItem',
	REMOVE_ITEM = 'RemoveItem',
	UPDATE_ITEM = 'UpdateItem',
}

export interface AddAccountAction {
	type: AccountActionTypes.ADD_ITEM
	account: Account | undefined
}

export interface RemoveAccountAction {
	type: AccountActionTypes.REMOVE_ITEM
	id: string
}

export interface UpdateAccountAction {
	type: AccountActionTypes.UPDATE_ITEM
	id: string
	issuer: string
	label: string
}

export type AccountAction = AddAccountAction | RemoveAccountAction | UpdateAccountAction
