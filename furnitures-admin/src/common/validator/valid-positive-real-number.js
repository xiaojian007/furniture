/**
 * 验证小数
 * @method validPositiveRealNumber
 * @param {Object} opts 参数
 * @param {Number|String} opts.value 字段值
 * @param {String} [opts.field] 字段名
 * @param {Number} [opts.decimals] 小数位
 * @param {Boolean} [opts.required] 是否必填
 * @param {Boolean} [opts.thanZero] 是否为正数
 * @returns {String} 验证信息
 */
export default function validPositiveRealNumber(opts) {
    opts = opts || {}
    opts.field = opts.field == null ? '' : opts.field
    opts.decimals = opts.decimals == null ? 2 : opts.decimals
    opts.required = opts.required == null ? false : opts.required
    opts.thanZero = opts.thanZero == null ? true : opts.thanZero
    let msg = ''
    let val = Number(opts.value)
    let str = String(opts.value).replace(/^-/, '')
    let regObj = {
        1: /^\d+(\.\d?)?$/,
        2: /^\d+(\.\d{0,2})?$/,
        3: /^\d+(\.\d{0,3})?$/,
        4: /^\d+(\.\d{0,4})?$/,
        5: /^\d+(\.\d{0,5})?$/,
        6: /^\d+(\.\d{0,6})?$/
    }
    let reg = regObj[opts.decimals] || regObj[2]
    if (opts.value === '') {
        msg = opts.required ? `请填写${opts.field}` : ''
    } else if (val === 0 && opts.notZero) {
        msg = `${opts.field}不能为 0`
    } else if (val < 0 && opts.thanZero) {
        msg = `${opts.field}必须大于 0`
    } else if (val < -999999999 && !opts.thanZero) {
        msg = `${opts.field}必须大于 -9999999999`
    } else if (val > 999999999) {
        msg = `${opts.field}必须小于 9999999999`
    } else if (/^0\d+/.test(str)) {
        msg = `${opts.field}不能以 0 开头`
    } else {
        if (opts.decimals == 1 && /\.\d{2,}$/.test(str)) {
            msg = `${opts.field}仅支持一位小数`
        } else if (opts.decimals == 2 && /\.\d{3,}$/.test(str)) {
            msg = `${opts.field}仅支持两位小数`
        } else if (opts.decimals == 3 && /\.\d{4,}$/.test(str)) {
            msg = `${opts.field}仅支持三位小数`
        } else if (opts.decimals == 4 && /\.\d{5,}$/.test(str)) {
            msg = `${opts.field}仅支持四位小数`
        } else if (opts.decimals == 5 && /\.\d{6,}$/.test(str)) {
            msg = `${opts.field}仅支持五位小数`
        } else if (opts.decimals == 6 && /\.\d{7,}$/.test(str)) {
            msg = `${opts.field}仅支持六位小数`
        } else if (reg.test(str)) {
            msg = ''
        } else {
            msg = `请填写正确的${opts.field}`
        }
    }
    return msg
}
