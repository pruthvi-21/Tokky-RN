import { DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD, generateUUID } from '../utils/Utils'
import { AlgorithmType } from '../utils/Constants'
import { getToken } from '../utils/RFC6238'

export default class Account {
    private _id: string
    private _issuer: string
    private _label: string
    private _secretKey: string

    private _algorithm: AlgorithmType
    private _digits: number
    private _period: number

    constructor(id: string, issuer: string, label: string, secretKey: string) {
        this._id = id
        this._issuer = issuer
        this._label = label
        this._secretKey = secretKey
        this._algorithm = DEFAULT_ALGORITHM
        this._digits = DEFAULT_DIGITS
        this._period = DEFAULT_PERIOD
    }

    set issuer(issuer: string) {
        this._issuer = issuer
    }

    set label(label: string) {
        this._label = label
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

    getCurrentToken(): string {
        return getToken(this.secretKey, { algorithm: this.algorithm, digits: this.digits, period: this.period })
    }
    currentOTP: string = ''
    private _lastUpdatedCounter: number = 0

    updateOTP(): Boolean {
        const time = Date.now() / 1000
        const count = time / this.period

        if (count > this._lastUpdatedCounter) {
            this.currentOTP = this.getCurrentToken()
            this._lastUpdatedCounter = count
            return true
        }
        return false
    }

    json() {
        return {
            id: this._id,
            data: {
                issuer: this._issuer,
                label: this._label,
                secretKey: this._secretKey,
            },
        }
    }

    public static createAccount(issuer: string, label: string, secretKey: string): Account {
        const uuid = generateUUID()
        return new Account(uuid, issuer, label, secretKey)
    }
}
