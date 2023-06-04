import { AccountEntryMethod, AlgorithmType, DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD, OTPType } from '../utils/Constants'
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

    private _createdOn: Date
    private _updatedOn: Date
    private _addedFrom: AccountEntryMethod

    currentOTP: string = ''
    private _lastUpdatedCounter: number = 0

    constructor(
        id: string,
        issuer: string,
        label: string = '',
        secretKey: string,
        type: OTPType = OTPType.TOTP,
        algorithm: AlgorithmType = DEFAULT_ALGORITHM,
        digits: number = DEFAULT_DIGITS,
        period: number = DEFAULT_PERIOD,
        createdOn: Date,
        updatedOn: Date,
        addedFrom: AccountEntryMethod = AccountEntryMethod.FORM,
    ) {
        this._id = id
        this._issuer = issuer
        this._label = label
        this._secretKey = secretKey
        this._type = type
        this._algorithm = algorithm
        this._digits = digits
        this._period = period
        this._createdOn = createdOn
        this._updatedOn = updatedOn
        this._addedFrom = addedFrom
    }

    set issuer(issuer: string) {
        this._issuer = issuer
        this._updatedOn = new Date()
    }

    set label(label: string) {
        this._label = label
        this._updatedOn = new Date()
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

    get createdOn(): Date {
        return this._createdOn
    }

    get updatedOn(): Date {
        return this._updatedOn
    }

    get name(): string {
        return this._issuer + ' (' + this._label + ')'
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
}

export class AccountBuilder {
    private _issuer: string = ''
    private _label: string = ''
    private _secretKey: string = ''
    private _type: OTPType = OTPType.TOTP
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

    build(): Account {
        if (this._issuer == '') throw Error("Issuer can't be empty")
        if (this._secretKey == '') throw Error("Secret key can't be empty")

        const account = new Account(
            generateUUID(),
            this._issuer,
            this._label,
            this._secretKey,
            this._type,
            this._algorithm,
            this._digits,
            this._period,
            new Date(),
            new Date(),
            this._addedVia,
        )

        return account
    }
}
