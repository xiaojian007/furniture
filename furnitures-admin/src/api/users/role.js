import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get } = generateModuleRequest("");

/**
 * 添加角色&修改角色
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const addAndUpdateRole = params => {
	let url = "/role/save";
	if (params.id > 0) {
		url = "/product/page";
	}
	return post(url, params);
};

/**
 * 修改角色
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getRoleList = params => {
	return post("/role/page", params);
};


/**
 * 删除角色
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deleteRole = params => {
	return post("/role/delete", params);
};
