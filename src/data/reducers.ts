import Account from '../models/Account'
import { AccountAction, AccountActionTypes } from './types'

const initialState: { accounts: Account[] } = {
	accounts: [],
}

export const mainReducer = (state = initialState, action: AccountAction) => {
	switch (action.type) {
		case AccountActionTypes.LOAD_ITEMS:
			return {
				...state,
				accounts: action.payload.sort((a, b) => (a.issuer + a.label).localeCompare(b.issuer + b.label)),
			}
		case AccountActionTypes.ADD_ITEM:
			if (action.payload == undefined) return state
			return {
				...state,
				accounts: [...state.accounts, action.payload].sort((a, b) =>
					(a.issuer + a.label).localeCompare(b.issuer + b.label)
				),
			}
		case AccountActionTypes.REMOVE_ITEM:
			return {
				...state,
				accounts: state.accounts.filter((item) => item.id !== action.payload),
			}
		case AccountActionTypes.UPDATE_ITEM:
			if (action.payload == undefined) return state

			const updatedList = state.accounts.map((item) => {
				if (item.id === action.payload!.id) {
					item.issuer = action.payload!.issuer
					item.label = action.payload!.label
				}
				return item
			})
			return {
				...state,
				accounts: updatedList.sort((a, b) => (a.issuer + a.label).localeCompare(b.issuer + b.label)),
			}
		default:
			return state
	}
}

export type RootState = ReturnType<typeof mainReducer>
