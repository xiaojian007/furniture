/**
 * 常量
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description 常量定义
 * @copyright lijian
 */

/**
 * 常用正则表达式
 */
export const REGULARS = {
	uuid: /^[A-Za-z0-9]{3,20}$/,
	mobile: /^1[3456789]\d{9}$/,
	mobileTel: /^[+\-\s0-9]{6,20}$/,
	email: /^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$|^1[3|4|5|7|8]\d{9}$/,
	idCard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
	creditCode: /[0-9a-zA-Z]{18}/, // 统一社会信用代码
	identificationNumber: /[0-9a-zA-Z]{20}/, // 纳税人识别号
	// mobileEmail: /^1[3|4|5|6|7|8|9]\d{9}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	bankCode: /^[\s0-9]{12,24}$/,
	qq: /^[0-9]{5,13}$/,
	pwd: /^\S{6,16}$/,
	date: /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31))|(([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/,
	blank: /\s+/g,
	nonempty: /^\S+$/,
	textShort: /^.{0,20}$/,
	textLong: /^.{0,50}$/,
	textarea: /^.{0,200}$/
};

/**
 * 七牛云文件存储地址
 */
export const BASE_FILE_URL = "//wg.cloud.lijian/";

/**
 * 翻页pager
 */
export const PAGE_SIZES = [10, 20, 30, 40];
