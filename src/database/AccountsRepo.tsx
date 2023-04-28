import Account from '../models/Account'

export default class AccountsRepo {
	accounts: Account[] = []

	private constructor() {
		this.initRepo()
	}

	private initRepo() {
		this.accounts.push(Account.createAccount('Google', 'pruthvi-21@gmail.com', 'ADKJHDSKJFSDKFHJ'))
		this.accounts.push(Account.createAccount('Amazon', 'sam-1234', 'ADKJHDSKJFSDKFHJ'))
		this.accounts.push(Account.createAccount('Instagram', 'mike.789', 'ADKJHDSKJFSDKFHJ'))
		this.accounts.push(Account.createAccount('Bitwarden', 'pruthvi.21', 'ADKJHDSKJFSDKFHJ'))
		this.accounts.push(Account.createAccount('Whatsapp', 'bhvn', 'ADKJHDSKJFSDKFHJ'))
		this.sortList()
	}

	sortList() {
		this.accounts.sort((a, b) => (a.issuer < b.issuer ? -1 : 1))
	}

	add(account: Account) {
		this.accounts.push(account)
	}

	remove(account: Account) {
		this.accounts = this.accounts.filter((item) => item.issuer !== account.issuer)
	}

	private static instance: AccountsRepo | null = null
	public static getInstance(): AccountsRepo {
		if (AccountsRepo.instance == null) {
			AccountsRepo.instance = new AccountsRepo()
		}
		return this.instance!
	}
}
