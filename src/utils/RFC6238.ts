//From https://github.com/bellstrand/totp-generator
import JsSHA from 'jssha'
import { DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD } from './Constants'
import { AlgorithmType } from './Constants'

type Options = {
    period?: number
    digits?: number
    algorithm?: AlgorithmType
}

export function getToken(key: string, options: Options = {}) {
    const period = options.period || DEFAULT_PERIOD
    const algorithm = options.algorithm || DEFAULT_ALGORITHM
    const digits = options.digits || DEFAULT_DIGITS

    const epoch = Math.floor(Date.now() / 1000.0)
    const time = dec2Hex(Math.floor(epoch / period)).padStart(16, '0')

    const shaObj = new JsSHA(algorithm, 'HEX')
    shaObj.setHMACKey(key, 'HEX')
    shaObj.update(time)

    const hmac = shaObj.getHMAC('HEX')
    const offset = hex2Dec(hmac.substring(hmac.length - 1))

    const otp = (hex2Dec(hmac.substr(offset * 2, 8)) & hex2Dec('7fffffff')) + ''
    return otp.substr(Math.max(otp.length - digits, 0), options.digits)
}

function hex2Dec(str: string) {
    return parseInt(str, 16)
}

function dec2Hex(num: number) {
    return (num < 15.5 ? '0' : '') + Math.round(num).toString(16)
}
