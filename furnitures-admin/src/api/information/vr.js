import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 添加VR&修改VR
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const addAndUpdateVr = params => {
	let url = "/vrnews/save";
	if (params.vrId > 0) {
		url = "/vrnews/update";
	}
	return post(url, params);
};

/**
 * 获取列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getVrList = params => {
	return get("/vrnews/page", params);
};
/**
 * 删除VR
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deteleVr = params => {
	return post("/vrnews/delete", params);
};

/**
 * VR详情
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getVrDetail = params => {
	return post("/vrnews/detail", params);
};
