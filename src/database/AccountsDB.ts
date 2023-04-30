import * as SQLite from 'expo-sqlite'
import Account from '../models/Account'

export class AccountsDB {
	private _db

	private constructor() {
		this._db = SQLite.openDatabase('tokky.db', '1.0')
	}

	public async init(): Promise<void> {
		await this.executeSql(
			`CREATE TABLE IF NOT EXISTS accounts (
             id TEXT PRIMARY KEY,
             data TEXT NOT NULL
            )`
		)
	}

	public async insert(account: Account | undefined): Promise<number | undefined> {
		if (account == undefined) return -1
		const result = await this.executeSql(`INSERT INTO accounts (id, data) VALUES (?, ?)`, [
			account.json().id,
			JSON.stringify(account.json().data),
		])
		return result.insertId
	}

	public async remove(id: string | null | undefined): Promise<number> {
		if (id == null || id == undefined) return 0
		const result = await this.executeSql(`DELETE FROM accounts WHERE id=?`, [id])
		return result.rowsAffected
	}

	public async update(account: Account): Promise<number | undefined> {
		const result = await this.executeSql(
			`UPDATE accounts 
			 SET data=?
			 WHERE id=?
			`,
			[JSON.stringify(account.json().data), account.id]
		)
		return result.insertId
	}

	public async getAll(): Promise<Account[]> {
		const result = await this.executeSql(`SELECT * FROM accounts`, [])

		const accounts: Account[] = []
		for (let i = 0; i < result.rows.length; i++) {
			const account = result.rows.item(i)
			const data = JSON.parse(account.data)
			accounts.push(new Account(account.id, data.issuer, data.label, data.secretKey))
		}

		return accounts
	}

	private async executeSql(query: string, params: any[] = []): Promise<SQLite.SQLResultSet> {
		return new Promise((resolve, reject) => {
			this._db.transaction((tx) => {
				tx.executeSql(
					query,
					params,
					(_, result) => resolve(result),
					(_, error) => {
						reject(error)
						return true
					}
				)
			})
		})
	}

	private static instance: AccountsDB
	public static getInstance(): AccountsDB {
		if (AccountsDB.instance == undefined) {
			AccountsDB.instance = new AccountsDB()
		}
		return this.instance!
	}
}
