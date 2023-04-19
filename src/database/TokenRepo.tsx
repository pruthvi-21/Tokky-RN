import TokenModel from "../models/TokenModel"

export class TokenRepo {
	tokensList: TokenModel[] = []

	private constructor() {
		this.initRepo()
	}

	private initRepo() {
		this.tokensList?.push(
			TokenModel.buildToken(
				"Google",
				"pruthvi-21@gmail.com",
				"ADKJHDSKJFSDKFHJ"
			)
		)
		this.tokensList?.push(
			TokenModel.buildToken("Amazon", "sam-1234", "ADKJHDSKJFSDKFHJ")
		)
		this.tokensList?.push(
			TokenModel.buildToken("Instagram", "mike.789", "ADKJHDSKJFSDKFHJ")
		)
		this.tokensList?.push(
			TokenModel.buildToken("Bitwarden", "pruthvi.21", "ADKJHDSKJFSDKFHJ")
		)
		this.tokensList?.push(
			TokenModel.buildToken("Whatsapp", "bhvn", "ADKJHDSKJFSDKFHJ")
		)
		this.sortList()
	}

	sortList() {
		this.tokensList.sort((a, b) => (a.issuer < b.issuer ? -1 : 1))
	}

	add(token: TokenModel) {
		this.tokensList.push(token)
	}

	private static instance: TokenRepo | null = null
	public static getInstance(): TokenRepo {
		if (TokenRepo.instance == null) {
			TokenRepo.instance = new TokenRepo()
		}
		return this.instance!
	}
}
