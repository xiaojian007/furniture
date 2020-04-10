/**
 * 格式化显示处理类
 * @summary 格式化显示处理类
 * @namespace formatter
 * @author shlijian@ininin.com
 * @version 1.0.0
 * @since 2020/03/05
 * @constructor
 */

/**
 * 时间格式化
 * @param {String} date 时间
 * @returns {string} 格式化字符串
 */
export const formatDateOutput = date => {
	return String(date || "").replace(" ", "<br/>");
};
