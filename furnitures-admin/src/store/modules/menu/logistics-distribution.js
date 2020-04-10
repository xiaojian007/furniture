/**
 * 订单板块路由
 * @author shlijian@ininin.com
 * @since 2020-02-24
 * @version 1.0.0
 * @description 订单板块路由创建
 * @copyright ininin.com
 */
import permission from "@config/config.permission";
export default [
	{
		path: "",
        name: "logistics-distribution",
		component: () => import(/* webpackChunkName: "logistics-distribution" */ "@views/logistics-distribution"),
		meta: {
            label: "首页",
            icon: "icon-visitList",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
