import Account from '../models/Account'

export default class AccountsRepo {
	accountsList: Account[] = []

	private constructor() {
		this.initRepo()
	}

	private initRepo() {
		this.accountsList?.push(Account.createAccount('Google', 'pruthvi-21@gmail.com', 'ADKJHDSKJFSDKFHJ'))
		this.accountsList?.push(Account.createAccount('Amazon', 'sam-1234', 'ADKJHDSKJFSDKFHJ'))
		this.accountsList?.push(Account.createAccount('Instagram', 'mike.789', 'ADKJHDSKJFSDKFHJ'))
		this.accountsList?.push(Account.createAccount('Bitwarden', 'pruthvi.21', 'ADKJHDSKJFSDKFHJ'))
		this.accountsList?.push(Account.createAccount('Whatsapp', 'bhvn', 'ADKJHDSKJFSDKFHJ'))
		this.sortList()
	}

	sortList() {
		this.accountsList.sort((a, b) => (a.issuer < b.issuer ? -1 : 1))
	}

	add(account: Account) {
		this.accountsList.push(account)
	}

	remove(account: Account) {
		this.accountsList = this.accountsList.filter((item) => item.issuer !== account.issuer)
	}

	private static instance: AccountsRepo | null = null
	public static getInstance(): AccountsRepo {
		if (AccountsRepo.instance == null) {
			AccountsRepo.instance = new AccountsRepo()
		}
		return this.instance!
	}
}
