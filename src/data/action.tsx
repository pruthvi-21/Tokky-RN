import TokenModel from '../models/TokenModel'

export const ADDITEM = 'AddItem'
export const REMOVEITEM = 'RemoveItem'

export interface AddTokenOperation {
	type: typeof ADDITEM
	token: TokenModel | undefined
}

export interface RemoveTokenOperation {
	type: typeof REMOVEITEM
	id: string
}

export type TokenOperations = AddTokenOperation | RemoveTokenOperation

export const addToken = (token: TokenModel): AddTokenOperation => ({
	type: ADDITEM,
	token: token,
})
export const removeToken = (id: string): RemoveTokenOperation => ({
	type: REMOVEITEM,
	id,
})
