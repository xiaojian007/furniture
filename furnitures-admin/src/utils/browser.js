/**
* 浏览器工具类
* @author shlijian@ininin.com
* @since 2020-02-21
* @version 1.0.0
* @description 获取浏览器相关信息的工具函数
* @copyright ininin.com
*/

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
