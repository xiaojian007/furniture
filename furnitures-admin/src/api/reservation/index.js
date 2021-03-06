import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 获取预约列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getSubscribeList = params => {
	return get("/subscribe/page", params);
};
/**
 * 修改预约状态
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const updateSubscribe = params => {
	return post("/subscribe/update", params);
};
