import axios from "axios";
import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 获取商品类型列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getProductTypeList = params => {
	return get("/producttype/list", params);
};

/**
 * 获取商品列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getProductList = params => {
	return get("/product/page", params);
};

/**
 * 获取商品类型和商品列表
 * @method getProductAndProductType
 * @param {Object} params
 * @returns {Promise} 返回一个promise
 */
export const getProductAndProductType = params => {
	return axios.all([getProductTypeList(params), getProductList(params)]);
};

/**
 * 添加产品类别
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const addAndUpdateProductType = params => {
    let url = "/producttype/save";
	if (params.id > 0) {
		url = "/producttype/update";
	}
	return post(url, params);
};


/**
 * 删除产品类别
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deleteProductType = params => {
	return post("/producttype/delete", params);
};
/**
 * 获取产品类别
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getProductType = params => {
	return get("/producttype/detail", params);
};
