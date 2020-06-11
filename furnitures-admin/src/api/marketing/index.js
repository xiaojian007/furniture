import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 添加数据字典&修改数据字典
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const addAndUpdateDict = params => {
	let url = "/dict/save";
	if (params.dictId > 0) {
		url = "/dict/update";
	}
	return post(url, params);
};

export const updateDict = params => {
	return post("/dict/update", params);
};

/**
 * 获取数据列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getDictList = params => {
	return get("/dict/page", params);
};
/**
 * 删除数据字典
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deteleDict = params => {
	return post("/dict/delete", params);
};
