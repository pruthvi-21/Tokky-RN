import { DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD, generateUUID } from '../Utils'

export default class Account {
	private _id: string
	private _issuer: string
	private _label: string
	private _secretKey: string

	private _algorithm: string
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

	get algorithm(): string {
		return this._algorithm
	}

	get digits(): number {
		return this._digits
	}

	get period(): number {
		return this._period
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
