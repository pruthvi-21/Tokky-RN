import SQLite from 'react-native-sqlite-storage'
import { ColorValue } from 'react-native/types'
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
            `CREATE TABLE IF NOT EXISTS ACCOUNTS(
                ID text PRIMARY KEY,
                ISSUER text NOT NULL,
                LABEL text,
                KEY_INFO text NOT NULL,
                TYPE text NOT NULL,
                THUMB_COLOR text NOT NULL,
                ADDED_FROM text NOT NULL,
                CREATE_STP date NOT NULL,
                UPDATE_STP date NOT NULL
            )`,
        )
    }

    public async insert(account: Account | undefined): Promise<number | undefined> {
        if (account == undefined) return -1
        const result = await this.executeSql(
            `INSERT INTO ACCOUNTS
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                account.id,
                account.issuer,
                account.label,
                account.secretInfo,
                account.type,
                account.thumbnailColor,
                account.addedFrom,
                account.createdOn,
                account.updatedOn,
            ],
        )
        return result.insertId
    }

    public async remove(id: string | null | undefined): Promise<number> {
        if (id == null || id == undefined) return 0
        const result = await this.executeSql(`DELETE FROM accounts WHERE id=?`, [id])
        return result.rowsAffected
    }

    public async update(id: string, issuer: string, label: string, thumbnailColor: ColorValue): Promise<number | undefined> {
        const result = await this.executeSql(
            `UPDATE ACCOUNTS
			 SET ISSUER=?, LABEL=?, THUMB_COLOR=?
			 WHERE ID=?
			`,
            [issuer, label, thumbnailColor, id],
        )
        return result.insertId
    }

    public async getAll(): Promise<Account[]> {
        const result = await this.executeSql(`SELECT * FROM accounts`, [])

        const accounts: Account[] = []
        for (let i = 0; i < result.rows.length; i++) {
            const account = result.rows.item(i)
            const keyInfo = JSON.parse(account.KEY_INFO)
            const accountObj = new Account(
                account.ID,
                account.ISSUER,
                account.LABEL,
                keyInfo.secretKey,
                account.TYPE,
                account.THUMB_COLOR,
                keyInfo.algorithm,
                keyInfo.digits,
                keyInfo.period,
                account.CREATE_STP,
                account.UPDATE_STP,
                account.ADDED_FROM,
            )
            accounts.push(accountObj)
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
