/**
 * 本地用户登录信息
 * @author lijian
 * @since 2020-02-23
 * @version 1.0.0
 * @description 本地用户登录信息
 * @copyright lijian
 */

/* eslint-disable no-undef */
const localLoginData = {
	//本地用户登录信息
	dev: "eyJ0b2tlbiI6IjZmMmIwYTYzLWQ5ZjctNDUyZi04YzE5LTVjZDM4YmFjODVhNSJ9"
}[process.env.VUE_APP_API_MODE];

export default localLoginData;
