/**
 * 验证整数
 * @param {Object} opts 参数
 * @param {Number|String} opts.value 字段值
 * @param {String} [opts.field] 字段名
 * @param {Boolean} [opts.required] 是否必填
 * @returns {String} 验证信息
 */
export default function validPositiveInteger(opts) {
    opts = opts || {}
    opts.field = opts.field == null ? '' : opts.field
    opts.required = opts.required == null ? false : opts.required
    let msg = ''
    let val = Number(opts.value)
    let str = String(opts.value)
    if (opts.value === '') {
        msg = opts.required ? `请填写${opts.field}` : ''
    } else if (val === 0 && opts.notZero) {
        msg = `${opts.field}不能为 0`
    } else if (val < 0 && opts.thanZero) {
        msg = `${opts.field}必须大于 0`
    } else if (val > 999999999) {
        msg = `${opts.field}必须小于 9999999999`
    } else if (/^0\d+/.test(str)) {
        msg = `${opts.field}不能以 0 开头`
    } else if (/\.\d+$/.test(str)) {
        msg = `${opts.field}只能是整数`
    } else if (/^\d+$/.test(str)) {
        msg = ''
    } else {
        msg = `请填写正确的${opts.field}`
    }
    return msg
}
