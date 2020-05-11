import { generateModuleRequest } from "../utils";
/**生成模块请求方法 */
const { get, post } = generateModuleRequest("");

/**
 * 添加文章&修改文章
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const addAndUpdateArticle = params => {
	let url = "/article/save";
	if (params.articleId > 0) {
		url = "/article/update";
	}
	return post(url, params);
};

/**
 * 获取列表
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getArticleList = params => {
	return get("/article/page", params);
};
/**
 * 删除文章
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const deteleArticle = params => {
	return post("/article/delete", params);
};

/**
 * 文章详情
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const getArticleDetail = params => {
	return post("/article/detail", params);
};
