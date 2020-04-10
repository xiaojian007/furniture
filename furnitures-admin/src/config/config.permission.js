/**
 * api接口地址配置文件
 * @author shlijian@ininin.com
 * @since 2020-02-12
 * @version 1.0.0
 * @description 配置api接口地址
 * @copyright ininin.com
 */

/* eslint-disable no-undef */
const permission = {
	//测试环境
	dev: {
	    //价值链地图查看
        VALUE_CHAIN_LOOK: 0
	},
	//正式环境
	formal: {
        //价值链地图查看
        VALUE_CHAIN_LOOK: 0
	}
}[process.env.VUE_APP_API_MODE];

export default permission;
