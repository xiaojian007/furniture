import { checkParams, generateModuleRequest } from "./utils";
/**生成模块请求方法 */
const { post } = generateModuleRequest("/");

/**
 * 用户登录
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const submitLogin = params => {
    const valid = checkParams(params, {
		mobile: {
			type: "string",
			required: true
		},
		password: {
			type: "string",
			required: true
		}
	});
    return !valid.isPassed ? valid.error : post("login", params);
};
