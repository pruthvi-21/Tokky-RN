import { TokenRepo } from '../database/TokenRepo'
import TokenModel from '../models/TokenModel'
import { ADDITEM, TokenOperations, REMOVEITEM } from './action'

const initialState: { tokenList: TokenModel[] } = {
	tokenList: TokenRepo.getInstance().tokensList,
}

export const mainReducer = (state = initialState, action: TokenOperations) => {
	switch (action.type) {
		case ADDITEM:
			const newList = [...state.tokenList, action.token]
			return { tokenList: newList }
		case REMOVEITEM:
			const newList1 = state.tokenList.filter(
				(item) => item.issuer !== action.token.issuer
			)
			return { tokenList: newList1 }
		default:
			return state
	}
}

export type RootState = ReturnType<typeof mainReducer>
