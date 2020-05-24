import { instance } from "../http";

/**
 * 版本查询接口
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description 版本查询接口
 * @copyright lijian
 */

/**
 * 查询远程版本json
 * @method queryVersionJson
 * @param {Object} params 请求参数
 * @returns {Promise} 请求响应
 */
export const queryVersionJson = params => {
	const domain = [window.location.protocol, window.location.host].join("//");
	const version = new Date().getTime();
	params = params || {};
	params.v = version;
	return instance.get(`${domain}/static/version.json`, params);
};
