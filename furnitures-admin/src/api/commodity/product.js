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
	if (params.typeId > 0) {
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
	return post("/producttype/detail", params);
};

/**
 * 获取Sku类别
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getSkuType = params => {
	return get("/sku/list", params);
};

/**
 * 获取商品详情
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getProductDetail = params => {
	return post("/product/detail", params);
};

/**
 * 获取商品详情&获取sku类型&获取类别数据
 * @method getALLProductQuery
 * @param {Object} params
 * @returns {Promise} 返回一个promise
 */
export const getALLProductQuery = params => {
	if (params.productId > 0) {
		return axios.all([
			getProductTypeList(params),
			getSkuType(params),
			getProductDetail(params)
		]);
	} else {
		return axios.all([getProductTypeList(params), getSkuType(params)]);
	}
};

/**
 * 添加商品
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const addAndUpdateProduct = params => {
	let url = "/product/save";
	if (params.productId > 0) {
		url = "/product/update";
	}
	return post(url, params);
};

/**
 * 删除商品
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deteleProduct = params => {
	return post('/product/delete', params);
};

/**
 * 精选、上下架
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const updateFeaturedAndPutShelves = params => {
	return post('/product/update', params);
};
