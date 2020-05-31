import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 添加VR&修改VR
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const updateAbout = params => {
	return post("/dict/update", params);
};

/**
 * 获取列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getAboutList = params => {
	return get("/dict/page", params);
};
