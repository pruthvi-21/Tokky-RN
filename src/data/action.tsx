import Account from '../models/Account'

export const ADDITEM = 'AddItem'
export const REMOVEITEM = 'RemoveItem'

export interface AddAccountOperation {
	type: typeof ADDITEM
	account: Account | undefined
}

export interface RemoveAccountOperation {
	type: typeof REMOVEITEM
	id: string
}

export type AccountOperations = AddAccountOperation | RemoveAccountOperation

export const addAccount = (account: Account): AddAccountOperation => ({
	type: ADDITEM,
	account: account,
})
export const removeAccount = (id: string): RemoveAccountOperation => ({
	type: REMOVEITEM,
	id,
})
