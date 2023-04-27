import AccountsRepo from '../database/AccountsRepo'
import Account from '../models/Account'
import { ADDITEM, AccountOperations, REMOVEITEM } from './action'

const initialState: { accountsList: Account[] } = {
	accountsList: AccountsRepo.getInstance().accountsList,
}

export const mainReducer = (state = initialState, action: AccountOperations) => {
	switch (action.type) {
		case ADDITEM:
			const newList = [...state.accountsList, action.account]
			return { accountsList: newList }
		case REMOVEITEM:
			const newList1 = state.accountsList.filter((item) => item.id !== action.id)
			return { accountsList: newList1 }
		default:
			return state
	}
}

export type RootState = ReturnType<typeof mainReducer>
