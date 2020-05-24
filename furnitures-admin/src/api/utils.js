/**
* api工具类
* @author lijian
* @since 2020-02-21
* @version 1.0.0
* @description api相关的工具函数
* @copyright lijian
*/

import { get, post, put, deletes } from "./http";
import { getDataType } from "@utils";

/**
 * 过滤掉值为空字符的参数
 * @param {Object} params 参数
 * @param {Boolean} excludeEmpty 是否排除空参数
 * @returns {Object} 过滤后参数对象
 */
export const filterParams = (params, excludeEmpty) => {
	let obj = {};
	if (typeof params === "object") {
		Object.entries(params).forEach(([key, value]) => {
			let temp = typeof value === "string" ? value.trim() : value;
			if (excludeEmpty) {
				if (temp !== "" && temp != null) {
					obj[key] = value;
				}
			} else {
				obj[key] = temp;
			}
		});
	}
	return obj;
};
/**
 * 标准化Types
 * @param {Object} types
 * @returns {Object} types
 */
const normalizeTypes = types => {
	let res = {};
	Object.entries(types).forEach(([key, value]) => {
		const valueType = getDataType(value);
		if (valueType === "string") {
			res[key] = {
				type: [value]
			};
		} else if (valueType === "array") {
			res[key] = {
				type: value
			};
		} else if (valueType === "object") {
			const typer = value.type;
			const type = getDataType(typer);
			if (type === "string") {
				res[key] = {
					...value,
					type: [typer]
				};
			} else if (type === "array") {
				res[key] = {
					...value
				};
			}
		}
	});
	return res;
};

/**
 * 必填验证函数
 * 验证必填参数每一项是否存在，不验证是否为假值  如 "" 或者 0 或者 null
 * @param {Array} requireds
 * @param {Object} params
 * @return {Object} 返回验证结果对象,对象包含
 */
export const checkRequired = (requireds, params) => {
	if (!requireds || !Array.isArray(requireds)) {
		return true;
	}
	const keys = Object.keys(params);
	const errors = requireds.reduce((errs, item) => {
		if (!keys.includes(item)) {
			errs.push(item);
		}
		return errs;
	}, []);
	const isPassed = !errors.length;
	return {
		isPassed,
		errors,
		errorMsg: isPassed ? null : `参数错误：${errors.join("、")} 为必填参数！`
	};
};

/**
 * 必填验证函数
 * 验证必填参数每一项是否存在，不验证是否为假值  如 "" 或者 0 或者 null
 * @param {Object} types
 * @param {Object} params
 * @return {Boolean} 返回布尔值
 */
export const checkTypes = (types, params) => {
	const keys = Object.keys(params);
	const nTypes = normalizeTypes(types);
	const errors = keys.reduce((errs, item) => {
		const value = params[item];
		const type = nTypes[item].type;
		const valueType = getDataType(value);
		if (!type.includes(valueType)) {
			errs.push({ key: item, valueType, targetType: type.join(" | ") });
		}
		return errs;
	}, []);
	const isPassed = !errors.length;
	const errorMsgBody = errors
		.reduce((msgs, item) => {
			msgs.push(`${item.key}：应该是 ${item.targetType} 类型，传递了 ${item.valueType} 类型`);
			return msgs;
		}, [])
		.join("；");
	return {
		isPassed,
		errors,
		errorMsg: `参数类型错误：${errorMsgBody}！`
	};
};

/**
 * 默认验证函数
 * 验证必填参数每一项是否存在，不验证是否为假值  如 "" 或者 0 或者 null
 * @param {Object} checker 校验对象
 * @param {Object} params 参数
 * @return {Boolean|Promise} 返回布尔值|reject状态的Promise
 */
const defaultChecker = (checker, params) => {
	const requireds = Object.keys(checker).filter(key => {
		const value = checker[key];
		if (getDataType(value) === "object") {
			return !!value.required;
		} else {
			return false;
		}
	});
	const reqObj = checkRequired(requireds, params);
	if (!reqObj.isPassed) {
		return {
			...reqObj,
			error: reqObj.isPassed ? null : Promise.reject(new Error(reqObj.errorMsg))
		};
	}
	const typeObj = checkTypes(checker, params);
	if (!typeObj.isPassed) {
		return {
			...typeObj,
			error: typeObj.isPassed ? null : Promise.reject(new Error(typeObj.errorMsg))
		};
	}
	return {
		isPassed: true
	};
};
/**
 * 检测是否符合必要参数设置
 * @param {Object} params
 * @param {Object|Function} checker 验证对象或验证函数
 *        Object： {
 *                  userId: {
 *                      type: ["string", "number"],
 *                      required: true
 *                  },
 *                  Name: {
 *                      type: "string",
 *                      required: true
 *                  },
 *                  userAge: "number",
 *                  address: "string"
 *              }
 *        Function： 校验函数默认使用 defaultChecker
 *                     函数回调参数为传递的params
 * @returns {Object} 验证对象
 */
export const checkParams = (params = {}, checker = {}) => {
	if (checker && typeof checker === "function") {
		return checker(params);
	} else {
		return defaultChecker(checker, params);
	}
};

/**
 * 去除重复斜杠
 * @param {String} url
 * @returns {String} 去除重复斜杠后的url
 */
function removeDuplicateSlashes(url) {
	return url.replace(/\/+/g, "/").replace(/\/$/, "");
}

/**
 * 生成模块内的请求方法
 * @param {String} module 模块名
 * @returns {Object} 返回一个包含get, post, put, deletes 方法的对象
 */
export const generateModuleRequest = module => ({
	get: (url, params) => get(removeDuplicateSlashes(`${module}/${url}`), params),
	post: (url, params) => post(removeDuplicateSlashes(`${module}/${url}`), params),
	put: (url, params) => put(removeDuplicateSlashes(`${module}/${url}`), params),
	deletes: (url, params) => deletes(removeDuplicateSlashes(`${module}/${url}`), params)
});
