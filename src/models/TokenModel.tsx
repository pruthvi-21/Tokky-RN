import { DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD } from "../Utils"

export default class TokenModel {
	id: string
	issuer: string
	label: string | null
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

	public static buildToken(
		issuer: string,
		label: string,
		secretKey: string
	): TokenModel {
		return new TokenModel("", issuer, label, secretKey)
	}
}
