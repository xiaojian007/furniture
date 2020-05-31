import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 获取订单列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getSubscribeList = params => {
	return get("/subscribe/page", params);
};
/**
 * 删除订单
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deteleSubscribe = params => {
	return post("/subscribe/delete", params);
};
