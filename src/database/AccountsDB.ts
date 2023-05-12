import SQLite from 'react-native-sqlite-storage'
import Account from '../models/Account'

class AccountsDB {
    private static instance: AccountsDB
    private _db: SQLite.SQLiteDatabase | null = null

    private constructor() {
        SQLite.enablePromise(true)
        SQLite.openDatabase({
            name: 'tokky.db',
            location: 'default',
        })
            .then(data => {
                this._db = data
                this.init()
            })
            .catch(err => {
                console.error('Failed to open database')
                console.error(err)
            })
    }

    public async init(): Promise<void> {
        await this.executeSql(
            `CREATE TABLE IF NOT EXISTS accounts (
             id TEXT PRIMARY KEY,
             data TEXT NOT NULL
            )`,
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
            [JSON.stringify(account.json().data), account.id],
        )
        return result.insertId
    }

    public async getAll(): Promise<Account[]> {
        const result = await this.executeSql(`SELECT * FROM accounts`, [])

        const accounts: Account[] = []
        for (let i = 0; i < result.rows.length; i++) {
            const account = result.rows.item(i)
            const data = JSON.parse(account.data)
            accounts.push(new Account(account.id, data.issuer, data.label, data.secretKey, data.algorithm, data.digits, data.period))
        }

        return accounts
    }

    private async executeSql(query: string, params: any[] = []): Promise<SQLite.ResultSet> {
        return new Promise((resolve, reject) => {
            if (this._db == null) reject('DB is null')
            this._db?.transaction(tx => {
                tx.executeSql(
                    query,
                    params,
                    (_, result) => resolve(result),
                    (_, error) => reject(error),
                )
            })
        })
    }

    public static getInstance(): AccountsDB {
        if (AccountsDB.instance == undefined) {
            AccountsDB.instance = new AccountsDB()
        }
        return this.instance!
    }
}

export default AccountsDB.getInstance()
