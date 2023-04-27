import { DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD, generateUUID } from '../Utils'

export default class Account {
	id: string
	issuer: string
	label: string
	secretKey: string

	algorithm: string
	digits: number
	period: number

	constructor(id: string, issuer: string, label: string, secretKey: string) {
		this.id = id
		this.issuer = issuer
		this.label = label
		this.secretKey = secretKey

		this.algorithm = DEFAULT_ALGORITHM
		this.digits = DEFAULT_DIGITS
		this.period = DEFAULT_PERIOD
	}

	public static createAccount(issuer: string, label: string, secretKey: string): Account {
		const uuid = generateUUID()
		return new Account(uuid, issuer, label, secretKey)
	}
}
