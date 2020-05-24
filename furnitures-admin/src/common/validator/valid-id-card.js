/**
* 身份证验证
* @author lijian
* @since 2020-02-21
* @version 1.0.0
* @description 定义身份证验证的相关函数
* @copyright lijian
*/

/**
 * 18位二代身份证号码的正则表达式
 */
const reg18 = /^\d{6}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
/**
 * 15位一代身份证号码的正则表达式
 */
const reg15 = /^\d{6}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/

/**
 *正则验证
 * @param {String} cardId 身份证号码
 * @param {RegExp} regex 正则
 * @returns {Boolean} true|false
 */
function regexMatch(cardId, regex) {
    return regex.test(cardId)
}

/**
 * 计算校验码 适用于18位的二代身份证号码
 * @param {String} str 本体码
 * @returns {String} 检验码
 */
function computeCheckNumber(str) {
    const weight = getWeight(str)
    const CHECK_CODE = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    return CHECK_CODE[weight % 11]
}

/**
 * 获取权重 适用于18位的二代身份证号码
 * @param {String} str 本体码
 * @returns {Number}权重
 */
function getWeight(str) {
    const WEIGHT_FACTOR = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    let weight = 0
    for (let i = 0, len = WEIGHT_FACTOR.length; i < len; i++) {
        weight += Number(str.charAt(i)) * WEIGHT_FACTOR[i]
    }
    if (str.length === 18) {
        const checkCode = str.charAt(17)
        weight += ['X', 'x'].includes(checkCode) ? 10 : Number(checkCode)
    }
    return weight
}

/**
 *验证身份证号码是否符合验证规则
 * @param {String} cardId 身份证号码
 * @returns {Boolean} true|false
 */
const validateCardNo = cardId => {
    if (
        !cardId ||
        typeof cardId !== 'string' ||
        ![15, 18].includes(cardId.length)
    ) {
        return false
    }

    const cardIdLen = cardId.length

    if (cardIdLen === 18 && regexMatch(cardId, reg18)) {
        const weight = getWeight(cardId)
        return weight % 11 === 1
    }
    if (cardIdLen === 15 && regexMatch(cardId, reg15)) {
        // 得到本体码，因一代身份证皆为19XX年生人，年份中增加19，组成4位
        const masterNumber = `${cardId.substring(0, 6)}19${cardId.substring(6)}`
        const checkNumber = computeCheckNumber(masterNumber)
        return validateCardNo(masterNumber + checkNumber)
    }
    return false
}

export default validateCardNo
