import {
    AccountEntryMethod,
    AlgorithmType,
    DEFAULT_ALGORITHM,
    DEFAULT_DIGITS,
    DEFAULT_PERIOD,
    OTPType,
    Thumbnail,
    ThumbnailIconType,
} from '../utils/Constants'
import { getToken } from '../utils/RFC6238'
import { generateUUID } from '../utils/Utils'

export default class Account {
    private _id: string
    private _issuer: string
    private _label: string

    private _secretKey: string
    private _algorithm: AlgorithmType
    private _digits: number
    private _period: number

    private _type: OTPType

    private _createdOn: string
    private _updatedOn: string
    private _addedFrom: AccountEntryMethod
    private _thumbnail: Thumbnail

    currentOTP: string = ''
    private _lastUpdatedCounter: number = 0

    constructor(
        id: string,
        issuer: string,
        label: string = '',
        secretKey: string,
        type: OTPType = OTPType.TOTP,
        thumbnail: Thumbnail,
        algorithm: AlgorithmType = DEFAULT_ALGORITHM,
        digits: number = DEFAULT_DIGITS,
        period: number = DEFAULT_PERIOD,
        createdOn: string,
        updatedOn: string,
        addedFrom: AccountEntryMethod = AccountEntryMethod.FORM,
    ) {
        this._id = id
        this._issuer = issuer
        this._label = label
        this._secretKey = secretKey
        this._type = type
        this._thumbnail = thumbnail
        this._algorithm = algorithm
        this._digits = digits
        this._period = period
        this._createdOn = createdOn
        this._updatedOn = updatedOn
        this._addedFrom = addedFrom
    }

    set issuer(issuer: string) {
        this._issuer = issuer
        this._updatedOn = new Date().toISOString()
    }

    set label(label: string) {
        this._label = label
        this._updatedOn = new Date().toISOString()
    }

    get id(): string {
        return this._id
    }

    get issuer(): string {
        return this._issuer
    }

    get label(): string {
        return this._label
    }

    get type(): OTPType {
        return this._type
    }

    get secretKey(): string {
        return this._secretKey
    }

    get algorithm(): AlgorithmType {
        return this._algorithm
    }

    get digits(): number {
        return this._digits
    }

    get period(): number {
        return this._period
    }

    get addedFrom(): AccountEntryMethod {
        return this._addedFrom
    }

    get createdOn(): string {
        return this._createdOn
    }

    get updatedOn(): string {
        return this._updatedOn
    }

    get name(): string {
        return this._issuer + ' (' + this._label + ')'
    }

    set thumbnail(item: Thumbnail) {
        this._thumbnail = item
    }

    get thumbnail(): Thumbnail {
        return this._thumbnail
    }

    get secretInfo(): string {
        const json: any = { secretKey: this._secretKey }

        if (this.algorithm !== DEFAULT_ALGORITHM) {
            json.algorithm = this.algorithm
        }

        if (this.period !== DEFAULT_PERIOD) {
            json.period = this.period
        }

        if (this.digits !== DEFAULT_DIGITS) {
            json.digits = this.digits
        }

        return JSON.stringify(json)
    }

    updateOTP(): Boolean {
        const time = Date.now() / 1000
        const count = Math.floor(time / this.period)

        if (count > this._lastUpdatedCounter) {
            this.currentOTP = getToken(this.secretKey, {
                algorithm: this.algorithm,
                digits: this.digits,
                period: this.period,
            })
            this._lastUpdatedCounter = count
            return true
        }
        return false
    }

    getCSV(): string {
        function getStr(str: any) {
            if (typeof str === 'string' && str.includes(',')) {
                return `"${str}"`
            }
            return str
        }

        let csvRow = getStr(this.issuer) + ','

        if (this.label !== '') {
            csvRow += getStr(this.label)
        }
        csvRow += ','

        csvRow += this.secretKey + ','

        if (this.type !== OTPType.TOTP) {
            csvRow += getStr(this.type)
        }
        csvRow += ','

        if (this.algorithm !== DEFAULT_ALGORITHM) {
            csvRow += getStr(this.algorithm)
        }
        csvRow += ','

        if (this.digits !== DEFAULT_DIGITS) {
            csvRow += getStr(this.digits)
        }
        csvRow += ','

        if (this.period !== DEFAULT_PERIOD) {
            csvRow += getStr(this.period)
        }
        csvRow += '&.&'

        return csvRow
    }

    getJSON() {
        const json: {
            issuer: string
            label?: string
            secretKey: string
            type?: OTPType
            algorithm?: string
            digits?: number
            period?: number
        } = {
            issuer: this.issuer,
            secretKey: this.secretKey,
        }

        if (this.label !== '') {
            json['label'] = this.label
        }

        if (this.type !== OTPType.TOTP) {
            json['type'] = this.type
        }

        if (this.algorithm !== DEFAULT_ALGORITHM) {
            json['algorithm'] = this.algorithm
        }

        if (this.digits !== DEFAULT_DIGITS) {
            json['digits'] = this.digits
        }

        if (this.period !== DEFAULT_PERIOD) {
            json['period'] = this.period
        }

        return json
    }
}

export class AccountBuilder {
    private _issuer: string = ''
    private _label: string = ''
    private _secretKey: string = ''
    private _type: OTPType = OTPType.TOTP
    private _thumbnail: Thumbnail = { type: ThumbnailIconType.COLOR, value: 'grey' }
    private _algorithm: AlgorithmType = DEFAULT_ALGORITHM
    private _digits: number = DEFAULT_DIGITS
    private _period: number = DEFAULT_PERIOD

    private _addedVia: AccountEntryMethod = AccountEntryMethod.FORM

    setIssuer(issuer: string): AccountBuilder {
        this._issuer = issuer
        return this
    }

    setLabel(label: string): AccountBuilder {
        this._label = label
        return this
    }

    setSecretKey(secretKey: string): AccountBuilder {
        this._secretKey = secretKey
        return this
    }

    setType(type: OTPType): AccountBuilder {
        this._type = type
        return this
    }

    setAlgorithm(algorithm: AlgorithmType): AccountBuilder {
        this._algorithm = algorithm
        return this
    }

    setDigits(digits: number): AccountBuilder {
        this._digits = digits
        return this
    }

    setPeriod(period: number): AccountBuilder {
        this._period = period
        return this
    }

    setAddedVia(via: AccountEntryMethod): AccountBuilder {
        this._addedVia = via
        return this
    }

    setThumbnail(item: Thumbnail): AccountBuilder {
        this._thumbnail = item
        return this
    }

    build(): Account {
        if (this._issuer == '') throw Error("Issuer can't be empty")
        if (this._secretKey == '') throw Error("Secret key can't be empty")

        const account = new Account(
            generateUUID(),
            this._issuer,
            this._label,
            this._secretKey,
            this._type,
            this._thumbnail,
            this._algorithm,
            this._digits,
            this._period,
            new Date().toISOString(),
            new Date().toISOString(),
            this._addedVia,
        )

        return account
    }

    buildFromCSV(csvRow: string): Account[] {
        const accounts: Account[] = []
        const rows = csvRow.split('&.&')

        for (const row of rows) {
            if (row.trim() === '') continue
            const values: any[] = []
            let currentValue = ''
            let withinQuotes = false

            for (let i = 0; i < row.length; i++) {
                const char = row[i]

                if (char === ',' && !withinQuotes) {
                    values.push(currentValue.trim())
                    currentValue = ''
                } else if (char === '"') {
                    withinQuotes = !withinQuotes
                } else {
                    currentValue += char
                }
            }

            values.push(currentValue.trim())

            const issuer = values[0]
            const label = values[1]
            const secretKey = values[2]
            const type = values[3]

            const algorithm = values[4]
            const digits = parseInt(values[5])
            const period = parseInt(values[6])

            const acc = new AccountBuilder()
                .setIssuer(issuer)
                .setLabel(label)
                .setSecretKey(secretKey)
                .setAddedVia(AccountEntryMethod.IMPORTED)

            if (type !== '') {
                acc.setType(type)
            }
            if (algorithm !== '') {
                acc.setAlgorithm(algorithm)
            }
            if (!isNaN(digits)) {
                acc.setDigits(digits)
            }
            if (!isNaN(period)) {
                acc.setPeriod(period)
            }

            accounts.push(acc.build())
        }

        return accounts
    }
}
