import TokenModel from '../models/TokenModel'

export const ADDITEM = 'AddItem'
export const REMOVEITEM = 'RemoveItem'

export interface AddTokenOperation {
	type: typeof ADDITEM
	token: TokenModel
}

export interface RemoveTokenOperation {
	type: typeof REMOVEITEM
	token: TokenModel
}

export type TokenOperations = AddTokenOperation | RemoveTokenOperation

export const addToken = (token: TokenModel): AddTokenOperation => ({
	type: ADDITEM,
	token: token,
})
export const removeToken = (token: TokenModel): RemoveTokenOperation => ({
	type: REMOVEITEM,
	token: token,
})
