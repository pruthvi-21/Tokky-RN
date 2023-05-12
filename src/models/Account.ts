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

    currentOTP: string = ''
    private _lastUpdatedCounter: number = 0

    constructor(
        id: string,
        issuer: string,
        label: string,
        secretKey: string,
        algorithm: AlgorithmType = DEFAULT_ALGORITHM,
        digits: number = DEFAULT_DIGITS,
        period: number = DEFAULT_PERIOD,
    ) {
        this._id = id
        this._issuer = issuer
        this._label = label
        this._secretKey = secretKey
        this._algorithm = algorithm
        this._digits = digits
        this._period = period
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

    json() {
        return {
            id: this._id,
            data: {
                issuer: this._issuer,
                label: this._label,
                secretKey: this._secretKey,
                algorithm: this._algorithm,
                digits: this._digits,
                period: this._period,
            },
        }
    }

    public static createAccount(
        issuer: string,
        label: string,
        secretKey: string,
        algorithm?: AlgorithmType,
        digits?: number,
        period?: number,
    ): Account {
        const uuid = generateUUID()
        return new Account(uuid, issuer, label, secretKey, algorithm, digits, period)
    }
}
