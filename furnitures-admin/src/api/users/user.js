import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 添加用户&修改用户
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const addAndUpdateUser = params => {
	let url = "/userinfo/save";
	if (params.userId > 0) {
		url = "/userinfo/update";
	}
	return post(url, params);
};

/**
 * 获取用户列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getUserList = params => {
	return get("/userinfo/page", params);
};
/**
 * 删除用户
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deteleUser = params => {
	return post("/userinfo/delete", params);
};
