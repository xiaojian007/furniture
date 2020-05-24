/**
 * 过滤空值
 * @author lijian
 * @param {String} value 值
 * @param {String} unit 单位
 * @returns {String} {*}
 */
export function nullValue(value, unit = '') {
    if (value == null) {
        return '-'
    } else if (value === '') {
        return '-'
    } else {
        return [value, unit].join('')
    }
}
