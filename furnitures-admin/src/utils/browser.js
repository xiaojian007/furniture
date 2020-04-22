/**
* 浏览器工具类
* @author shlijian@ininin.com
* @since 2020-02-21
* @version 1.0.0
* @description 获取浏览器相关信息的工具函数
* @copyright ininin.com
*/


import Transfer from "./transfer";

/**
 * 获取URL中“?”之后的指定参数
 * @method getQueryString
 * @param {String} [name] 必选，指定参数的KEY
 * @returns {String} 指定的参数值
 */
export const getQueryString = name => {
	return Transfer.decodeHashString(window.location.search.replace(/^\?+/, ""))[name];
};
/**
 * 获取URL中“?”之后的所有参数
 * @method getRequest
 * @param {String} [str] 可选，Hash对象，location.search 或 location.hash
 * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
 * @param {String} [flag==] 可选，默认“=”，键值分隔符
 * @returns {Object} 所有参数
 */
export const getRequest = (str, sign, flag) => {
	str = (str || window.location.search).replace(/^\?|#+/, ""); //获取url中'?'符后的字符串
	return Transfer.decodeHashString(str, sign, flag);
};
/**
 * 获取浏览器名称
 * @method getBrowserName
 * @returns {String} 浏览器名称
 */
export function getBrowserName() {
	const browserName = window.navigator.userAgent.toLowerCase();
	if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
		return "IE";
	} else if (/firefox/i.test(browserName)) {
		return "Firefox";
	} else if (
		/chrome/i.test(browserName) &&
		/webkit/i.test(browserName) &&
		/mozilla/i.test(browserName)
	) {
		return "Chrome";
	} else if (/opera/i.test(browserName)) {
		return "Opera";
	} else if (
		/webkit/i.test(browserName) &&
		!(
			/chrome/i.test(browserName) &&
			/webkit/i.test(browserName) &&
			/mozilla/i.test(browserName)
		)
	) {
		return "Safari";
	}
	return "unKnow";
}

/**
 * 设置URL查询参数
 * @method setURLSearch
 * @param {Object} params 查询参数
 * @param {String} hashPath hash路径
 */
export const setURLPath = (params, hashPath) => {
	let searchParams = getRequest(window.location.search);
	searchParams = Object.assign(searchParams, params);
	window.location.hash = hashPath;
	window.location.search = Transfer.encodeHashString(searchParams);
};
