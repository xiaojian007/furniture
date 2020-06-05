import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 修改
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const updateDiscountcash = params => {
	return post('/userdiscountcash/update', params);
};

/**
 * 获取列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getDiscountcashList = params => {
	return get("/userdiscountcash/page", params);
};
