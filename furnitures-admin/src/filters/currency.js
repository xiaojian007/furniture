/**
 * 货币格式化
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description 引入js-cookie
 * @copyright lijian
 */

const digitsRE = /(\d{3})(?=\d)/g;

/**
 * 货币格式化
 * @param {Number} value 数值
 * @param {String} currencyUnit 货币符号
 * @param {Number} decimals 小数位数
 * @returns {String} 结果
 */
export function currency(value, currencyUnit, decimals) {
	value = parseFloat(value);
	if (!isFinite(value) || (!value && value !== 0)) {
		return "";
	}
	//value = value > 0 ? value : 0
	currencyUnit = currencyUnit != null ? currencyUnit : ""; //'¥'
	decimals = decimals != null ? decimals : 2;
	let stringified = Math.abs(value).toFixed(decimals);
	let numInt = decimals ? stringified.slice(0, -1 - decimals) : stringified;
	let i = numInt.length % 3;
	let head = i > 0 ? numInt.slice(0, i) + (numInt.length > 3 ? "," : "") : "";
	let numFloat = decimals ? stringified.slice(-1 - decimals) : "";
	let sign = value < 0 ? "-" : "";
	return sign + currencyUnit + head + numInt.slice(i).replace(digitsRE, "$1,") + numFloat;
}
