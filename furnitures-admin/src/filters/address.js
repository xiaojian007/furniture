/**
 * 地址格式化
 * @author lijian
 * @since 2020-02-21
 * @param {String} value 地址
 * @param {Number} level 显示级别
 * @param {String} separator 分隔符
 * @returns {String} {*}
 */
export function location(value, level, separator) {
	if (value == null) {
		return "";
	}
	value = String(value);
	separator = separator != null ? separator : "^";
	let addressRegion = value.split(separator);
	level = level != null ? level : addressRegion.length;
	let start = 0;
	if (addressRegion[0] === addressRegion[1]) {
		start = 1;
	}
	return addressRegion.slice(start, level).join("");
}
