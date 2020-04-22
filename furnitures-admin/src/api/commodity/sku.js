import { generateModuleRequest } from "../utils";
import { post } from "../http";
/**生成模块请求方法 */
const { get } = generateModuleRequest("");

/**
 * 获取Sku类型列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getSkuTypeList = params => {
	return get("/sku/page", params);
};

/**
 * 添加sku类型
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const addAndUpdateSkuType = params => {
	let url = "/sku/save";
	if (params.skuId > 0) {
		url = "/sku/update";
	}
	return post(url, params);
};


/**
 * 获取sku类型详情
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getSkuType = params => {
	return post("/sku/detail", params);
};

/**
 * 添加sku类型
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deleteSkuType = params => {
	return post("/sku/delete", params);
};
/**
 * 获取Sku列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getSkuList = params => {
	return get("/sku/pageByLevel", params);
};
