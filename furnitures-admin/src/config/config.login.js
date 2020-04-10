/**
 * 未登录跳转地址
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 未登录跳转地址：主要用于跳转登录不是本项目登录页，可区分正式/测试环境
 * @copyright ininin.com
 */

/* eslint-disable no-undef */
const loginPath = {
	dev: `//alpha.ac.ininin.com/?v=${new Date().getTime()}#/`, //测试环境
	formal: "//ac.ininin.com/" //正式环境
}[process.env.VUE_APP_API_MODE];

export default loginPath;
