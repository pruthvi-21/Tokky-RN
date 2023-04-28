import AccountsRepo from '../database/AccountsRepo'
import Account from '../models/Account'
import { AccountActionTypes, AccountAction } from './types'

const initialState: { accounts: Account[] } = {
	accounts: AccountsRepo.getInstance().accounts,
}

export const mainReducer = (state = initialState, action: AccountAction) => {
	switch (action.type) {
		case AccountActionTypes.ADD_ITEM:
			return {
				...state,
				accounts: [...state.accounts, action.account],
			}
		case AccountActionTypes.REMOVE_ITEM:
			return {
				...state,
				accounts: state.accounts.filter((item) => item.id !== action.id),
			}
		case AccountActionTypes.UPDATE_ITEM:
			const updatedList = state.accounts.map((item) => {
				if (item.id === action.id) {
					item.issuer = action.issuer
					item.label = action.label
				}
				return item
			})
			return { ...state, accounts: updatedList }
		default:
			return state
	}
}

export type RootState = ReturnType<typeof mainReducer>
