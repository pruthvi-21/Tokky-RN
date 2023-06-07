import SQLite from 'react-native-sqlite-storage'
import { ColorValue } from 'react-native/types'
import Account from '../models/Account'
import { AccountEntryMethod, AlgorithmType, ENC_IV, ENC_KEY, OTPType } from '../utils/Constants'
import { CryptoUtils } from '../utils/CryptoUtils'
import { KeychainManager } from '../utils/KeychainManager'

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

        const key = await KeychainManager.fetchKey(ENC_KEY)
        const iv = await KeychainManager.fetchKey(ENC_IV)

        const encryptedEntries = [
            await CryptoUtils.encryptData(account.id, key, iv),
            await CryptoUtils.encryptData(account.issuer, key, iv),
            await CryptoUtils.encryptData(account.label, key, iv),
            await CryptoUtils.encryptData(account.secretInfo, key, iv),
            await CryptoUtils.encryptData(account.type, key, iv),
            await CryptoUtils.encryptData(account.thumbnailColor.toString(), key, iv),
            await CryptoUtils.encryptData(account.addedFrom, key, iv),
            await CryptoUtils.encryptData(account.createdOn, key, iv),
            await CryptoUtils.encryptData(account.updatedOn, key, iv),
        ]

        const result = await this.executeSql(
            `INSERT INTO ACCOUNTS
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            encryptedEntries,
        )
        return result.insertId
    }

    public async remove(id: string | null | undefined): Promise<number> {
        if (id == null || id == undefined) return 0

        const key = await KeychainManager.fetchKey(ENC_KEY)
        const iv = await KeychainManager.fetchKey(ENC_IV)

        const encryptedId = await CryptoUtils.encryptData(id, key, iv)

        const result = await this.executeSql(`DELETE FROM accounts WHERE id=?`, [encryptedId])
        return result.rowsAffected
    }

    public async update(id: string, issuer: string, label: string, thumbnailColor: ColorValue): Promise<number | undefined> {
        const key = await KeychainManager.fetchKey(ENC_KEY)
        const iv = await KeychainManager.fetchKey(ENC_IV)

        const encId = await CryptoUtils.encryptData(id, key, iv)
        const encIssuer = await CryptoUtils.encryptData(issuer, key, iv)
        const encLabel = await CryptoUtils.encryptData(label, key, iv)
        const encThumbnailColor = await CryptoUtils.encryptData(thumbnailColor.toString(), key, iv)

        const result = await this.executeSql(
            `UPDATE ACCOUNTS
			 SET ISSUER=?, LABEL=?, THUMB_COLOR=?
			 WHERE ID=?
			`,
            [encIssuer, encLabel, encThumbnailColor, encId],
        )
        return result.insertId
    }

    public async getAll(): Promise<Account[]> {
        const result = await this.executeSql(`SELECT * FROM accounts`, [])

        const key = await KeychainManager.fetchKey(ENC_KEY)
        const iv = await KeychainManager.fetchKey(ENC_IV)

        const accounts: Account[] = []
        for (let i = 0; i < result.rows.length; i++) {
            const account = result.rows.item(i)

            const id = await CryptoUtils.decryptData(account.ID, key, iv)
            const issuer = await CryptoUtils.decryptData(account.ISSUER, key, iv)
            const label = await CryptoUtils.decryptData(account.LABEL, key, iv)
            const keyInfo = await CryptoUtils.decryptData(account.KEY_INFO, key, iv)
            const type = await CryptoUtils.decryptData(account.TYPE, key, iv)
            const thumbnailColor = await CryptoUtils.decryptData(account.THUMB_COLOR, key, iv)
            const addedFrom = await CryptoUtils.decryptData(account.ADDED_FROM, key, iv)
            const createdOn = await CryptoUtils.decryptData(account.CREATE_STP, key, iv)
            const updatedOn = await CryptoUtils.decryptData(account.UPDATE_STP, key, iv)

            const keyInfoJson = JSON.parse(keyInfo)

            const accountObj = new Account(
                id,
                issuer,
                label,
                keyInfoJson.secretKey,
                type as OTPType,
                thumbnailColor,
                keyInfoJson.algorithm,
                keyInfoJson.digits,
                keyInfoJson.period,
                createdOn,
                updatedOn,
                addedFrom as AccountEntryMethod,
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
