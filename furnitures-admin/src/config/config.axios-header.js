/**
 * 请求头参数配置
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 请求头参数配置
 * @copyright ininin.com
 */

/* eslint-disable no-undef */

import { getBrowserName } from "@utils/browser";
import { version } from "@/../package.json";
const ENV = {
	dev: "develop",
	formal: "produce"
}[process.env.VUE_APP_API_MODE];

/**
 * 1、X-REQUEST-SOURCE，取值：IOS、Android、PC，小程序不传
 * 2、X-SYSTEM-VERSION，取值：手机系统版本号/浏览器名称，小程序不传
 * 3、X-CLIENT-VERSION，取值：程序版本号
 */
export default {
	"X-REQUEST-SOURCE": "PC",
	"X-SYSTEM-VERSION": getBrowserName(),
	"X-CLIENT-VERSION": `${ENV}:${version}`
};
