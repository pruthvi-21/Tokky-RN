export class Base32 {
    private static BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

    static base32ToHex(base32: string) {
        base32 = base32.replace(/=+$/, '')

        let bits = ''
        for (let i = 0; i < base32.length; i++) {
            let val = this.BASE32_CHARS.indexOf(base32.charAt(i).toUpperCase())
            if (val === -1) throw new Error('Invalid base32 character in key')
            bits += val.toString(2).padStart(5, '0')
        }

        let hex = ''
        for (let i = 0; i + 8 <= bits.length; i += 8) {
            let chunk = bits.substr(i, 8)
            hex = hex + parseInt(chunk, 2).toString(16).padStart(2, '0')
        }
        return hex
    }

    static hexToBase32(hex: string) {
        hex = hex.toUpperCase()

        let bits = ''
        for (let i = 0; i < hex.length; i++) {
            let val = parseInt(hex.charAt(i), 16)
            if (isNaN(val)) throw new Error('Invalid hexadecimal character in input')
            bits += val.toString(2).padStart(4, '0')
        }

        bits = bits.padEnd(Math.ceil(bits.length / 5) * 5, '0')

        let base32 = ''
        for (let i = 0; i + 5 <= bits.length; i += 5) {
            let chunk = bits.substr(i, 5)
            base32 = base32 + this.BASE32_CHARS.charAt(parseInt(chunk, 2))
        }

        return Base32.padBase32(base32)
    }

    private static padBase32(base32: string) {
        let paddedLength = Math.ceil(base32.length / 8) * 8
        let paddingLength = paddedLength - base32.length
        return base32.padEnd(base32.length + paddingLength, '=')
    }
}
