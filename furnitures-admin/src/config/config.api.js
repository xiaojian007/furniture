/**
* api接口地址配置文件
* @author shlijian@ininin.com
* @since 2020-02-21
* @version 1.0.0
* @description 配置api接口地址
* @copyright ininin.com
*/

/* eslint-disable no-undef */
const baseURL = {
    // dev: "http://192.168.1.103:8080/", //测试环境
    dev: "http://47.101.209.229:8080/", //测试环境
	formal: "//api.pdp.ininin.com/" //正式环境
}[process.env.VUE_APP_API_MODE];

export default baseURL;
