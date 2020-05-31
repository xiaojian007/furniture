import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get } = generateModuleRequest("");

/**
 * 获取角色列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getOperationLog = params => {
	return get("/log/page", params);
};
