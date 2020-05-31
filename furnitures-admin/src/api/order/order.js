import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 修改订单
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const updateOrder = params => {
	return post('/order/update', params);
};

/**
 * 获取订单列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getOrderList = params => {
	return get("/order/page", params);
};
/**
 * 获取订单详情
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getOrderDetail = params => {
	return post("/order/detail", params);
};
/**
 * 删除订单
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deteleOrder = params => {
	return post("/order/delete", params);
};
